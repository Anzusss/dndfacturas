<?php

declare(strict_types=1);

namespace App\Core\Documents\Infrastructure;

use App\Core\Documents\Domain\Repositories\DocumentRepositoryInterface;
use Config\Database;
use CodeIgniter\Database\BaseConnection;

class DocumentRepository implements DocumentRepositoryInterface
{
    /**
     * Obtiene el listado resumido de documentos (Facturas y Notas de Crédito) con paginación
     */
    public function getPaginatedSummary(int $page, int $perPage, ?string $search = null): array
    {
        // Conectamos a la base de datos de SQL Server (Dynamics GP)
        $db = Database::connect('sqlserver');
        $builder = $db->table('SOP30200');

        $builder->select("
            CAST(SOPNUMBE AS VARCHAR(50)) AS document_number,
            CAST(CASE SOPTYPE 
                WHEN 3 THEN 'Factura' 
                WHEN 4 THEN 'Nota de Crédito' 
                ELSE 'Otro' 
            END AS VARCHAR(50)) AS document_type,
            CAST(CASE VOIDSTTS 
                WHEN 0 THEN 'Emitido' 
                WHEN 1 THEN 'Anulado' 
                ELSE 'Desconocido' 
            END AS VARCHAR(50)) AS document_status,
            CAST(DOCDATE AS DATE) AS document_date,
            CAST(LTRIM(RTRIM(CUSTNAME)) AS VARCHAR(255)) AS customer_name,
            CAST(LTRIM(RTRIM(TXRGNNUM)) AS VARCHAR(100)) AS rif,
            ORDOCAMT AS total_transaction,
            DOCAMNT AS total_functional");

        // SOPTYPE: 3 = Facturas/ND, 4 = Notas de Crédito
        $builder->whereIn('SOPTYPE', [3, 4]);

        if (!empty($search)) {
            $builder->groupStart()
                ->like('SOPNUMBE', $search)
                ->orLike('CUSTNAME', $search)
                ->groupEnd();
        }

        // Clonamos para contar el total antes de aplicar límites
        $totalBuilder = clone $builder;
        $totalRecords = $totalBuilder->countAllResults(false);

        // Ordenamiento y paginación
        $builder->orderBy('DOCDATE', 'DESC');
        $builder->orderBy('SOPNUMBE', 'DESC');
        $builder->limit($perPage, ($page - 1) * $perPage);

        return [
            'items' => $builder->get()->getResultArray(),
            'total_items' => $totalRecords,
            'total_pages' => (int) ceil($totalRecords / $perPage)
        ];
    }

    /**
     * Obtiene todo el detalle completo (cabecera y líneas) de un documento específico
     */
    public function getDocumentDetails(string $documentNumber): ?array
    {
        $db = Database::connect('sqlserver');
        
        $header = $this->fetchDocumentHeader($db, $documentNumber);
        
        if (!$header) {
            return null;
        }

        $header['lines'] = $this->fetchDocumentLines($db, $documentNumber, $header['document_type_id']);
        
        $payments = $this->fetchDocumentPayments($db, $documentNumber);
        
        $this->applyRealIgtfFromPayments($header, $payments);

        return $header;
    }

    /**
     * Obtiene la cabecera del documento desde SOP30200
     */
    private function fetchDocumentHeader(BaseConnection $db, string $documentNumber): ?array
    {
        $builder = $db->table('SOP30200 H');
        $builder->select("
            CAST(H.SOPNUMBE AS VARCHAR(50)) AS document_number,
            CAST(H.DOCDATE AS DATE) AS document_date,
            CAST(H.DUEDATE AS DATE) AS due_date,
            CAST(LTRIM(RTRIM(H.CUSTNAME)) AS VARCHAR(255)) AS customer_name,
            CAST(LTRIM(RTRIM(H.TXRGNNUM)) AS VARCHAR(100)) AS rif,
            CAST(LTRIM(RTRIM(H.ADDRESS1)) + ' ' + LTRIM(RTRIM(H.ADDRESS2)) + ' ' + LTRIM(RTRIM(H.CITY)) AS VARCHAR(500)) AS address,
            CAST(H.PHNUMBR1 AS VARCHAR(50)) AS phone,
            CAST(H.CURNCYID AS VARCHAR(50)) AS currency_id,
            H.XCHGRATE AS exchange_rate,
            CAST(H.REFRENCE AS VARCHAR(255)) AS reference,
            H.ORSUBTOT AS net_total_transaction,
            H.ORTDISAM AS discount_transaction,
            H.ORTAXAMT AS tax_total_transaction,
            CASE WHEN (H.ORSUBTOT - H.ORTDISAM - H.OTAXTAMT) < 0 THEN 0 ELSE (H.ORSUBTOT - H.ORTDISAM - H.OTAXTAMT) END AS exempt_total_transaction,
            CAST((H.ORDOCAMT * 0.03) AS DECIMAL(19,5)) AS igtf_transaction,
            H.ORDOCAMT AS grand_total_transaction,
            H.SUBTOTAL AS net_total_functional,
            H.TRDISAMT AS discount_functional,
            H.TAXAMNT AS tax_total_functional,
            CASE WHEN (H.SUBTOTAL - H.TRDISAMT - H.TXBTXAMT) < 0 THEN 0 ELSE (H.SUBTOTAL - H.TRDISAMT - H.TXBTXAMT) END AS exempt_total_functional,
            CAST((H.DOCAMNT * 0.03) AS DECIMAL(19,5)) AS igtf_functional,
            H.DOCAMNT AS grand_total_functional,
            H.SOPTYPE as document_type_id
        ");
        
        $builder->where('H.SOPNUMBE', $documentNumber);
        $builder->whereIn('H.SOPTYPE', [3, 4]); // 3 = Facturas, 4 = NC
        
        return $builder->get()->getRowArray();
    }

    /**
     * Obtiene el detalle de artículos del documento desde SOP30300
     */
    private function fetchDocumentLines(BaseConnection $db, string $documentNumber, $documentTypeId): array
    {
        $builder = $db->table('SOP30300 D');
        $builder->select("
            D.QUANTITY AS quantity,
            CAST(LTRIM(RTRIM(D.ITEMDESC)) AS VARCHAR(255)) AS item_description,
            D.ORUNTPRC AS unit_price_transaction,
            D.OXTNDPRC AS subtotal_transaction,
            D.ORTAXAMT AS tax_transaction,
            D.UNITPRCE AS unit_price_functional,
            D.XTNDPRCE AS subtotal_functional,
            D.TAXAMNT AS tax_functional
        ");
        $builder->where('D.SOPNUMBE', $documentNumber);
        $builder->where('D.SOPTYPE', $documentTypeId);
        $builder->orderBy('D.LNITMSEQ', 'ASC');

        return $builder->get()->getResultArray();
    }

    /**
     * Obtiene los cobros aplicados desde RM20201 y RM30201 unidos con RM20101 y RM30101
     */
    private function fetchDocumentPayments(BaseConnection $db, string $documentNumber): array
    {
        $sql = "
            SELECT 
                CAST(A.APFRDCNM AS VARCHAR(50)) AS payment_number,
                CAST(A.DATE1 AS DATE) AS apply_date,
                A.ORAPTOAM AS applied_amount_transaction,
                A.APPTOAMT AS applied_amount_functional,
                '' AS bank_account,
                CAST(LTRIM(RTRIM(P.CURNCYID)) AS VARCHAR(50)) AS currency_id,
                CAST(P.DOCDATE AS DATE) AS payment_date,
                CAST(LTRIM(RTRIM(P.TRXDSCRN)) AS VARCHAR(255)) AS reference
            FROM RM20201 A
            INNER JOIN RM20101 P ON A.APFRDCNM = P.DOCNUMBR AND A.APFRDCTY = P.RMDTYPAL
            WHERE A.APTODCNM = ?
            
            UNION ALL
            
            SELECT 
                CAST(A.APFRDCNM AS VARCHAR(50)) AS payment_number,
                CAST(A.DATE1 AS DATE) AS apply_date,
                A.ORAPTOAM AS applied_amount_transaction,
                A.APPTOAMT AS applied_amount_functional,
                '' AS bank_account,
                CAST(LTRIM(RTRIM(P.CURNCYID)) AS VARCHAR(50)) AS currency_id,
                CAST(P.DOCDATE AS DATE) AS payment_date,
                CAST(LTRIM(RTRIM(P.TRXDSCRN)) AS VARCHAR(255)) AS reference
            FROM RM30201 A
            INNER JOIN RM30101 P ON A.APFRDCNM = P.DOCNUMBR AND A.APFRDCTY = P.RMDTYPAL
            WHERE A.APTODCNM = ?
        ";

        return $db->query($sql, [$documentNumber, $documentNumber])->getResultArray();
    }

    /**
     * Calcula el IGTF basándose exclusivamente en los cobros en divisas y lo anexa a la respuesta
     */
    private function applyRealIgtfFromPayments(array &$header, array $payments): void
    {
        $realIgtfFunctional = 0.0;
        $realIgtfTransaction = 0.0;

        foreach ($payments as &$payment) {
            $currency = trim(strtoupper($payment['currency_id'] ?? ''));
            // Ajusta estos IDs si en tu GP Dólares tiene otro nombre
            $isDollar = in_array($currency, ['Z-US$', 'USD', 'US$', 'DOLARES', 'DOLAR']);

            if ($isDollar) {
                $igtfFunc = (float) $payment['applied_amount_functional'] * 0.03;
                $igtfTrans = (float) $payment['applied_amount_transaction'] * 0.03;

                $payment['applied_igtf_functional'] = number_format($igtfFunc, 5, '.', '');
                $payment['applied_igtf_transaction'] = number_format($igtfTrans, 5, '.', '');

                $realIgtfFunctional += $igtfFunc;
                $realIgtfTransaction += $igtfTrans;
            } else {
                $payment['applied_igtf_functional'] = "0.00000";
                $payment['applied_igtf_transaction'] = "0.00000";
            }
        }

        $header['payments'] = $payments;

        // Sobrescribimos el IGTF estimado por el real sumado de los pagos
        $header['igtf_functional'] = number_format($realIgtfFunctional, 5, '.', '');
        $header['igtf_transaction'] = number_format($realIgtfTransaction, 5, '.', '');
    }
}
