SELECT 
    -- 1. CABECERA CLIENTE
    H.SOPNUMBE AS [Nro de Factura],
    CAST(H.DOCDATE AS DATE) AS [Fecha],
    CAST(H.DUEDATE AS DATE) AS [Fecha Vence],
    LTRIM(RTRIM(H.CUSTNAME)) AS [Cliente],
    LTRIM(RTRIM(H.TXRGNNUM)) AS [RIF], 
    LTRIM(RTRIM(H.ADDRESS1)) + ' ' + LTRIM(RTRIM(H.ADDRESS2)) + ' ' + LTRIM(RTRIM(H.CITY)) AS [Direccion],
    H.PHNUMBR1 AS [Telefono],
    
    -- MONEDA
    H.CURNCYID AS [ID Moneda],
    H.XCHGRATE AS [Tasa de Cambio],
    
    -- COMENTARIOS / COLETILLAS
    H.REFRENCE AS [Descripcion o Comentarios],
    
    -- 2. LINEAS DE PRODUCTOS
    D.QUANTITY AS [Cantidad],
    D.ITEMDESC AS [Descripcion Producto],
    
    -- MONEDA LOCAL (TRANSACCION)
    D.ORUNTPRC AS [Tarifa (Moneda Transaccion)],
    D.OXTNDPRC AS [Subtotal Linea (Moneda Transaccion)],
    D.ORTAXAMT AS [IVA Linea (Moneda Transaccion)],
    
    -- MONEDA FUNCIONAL (BASE)
    D.UNITPRCE AS [Tarifa (Moneda Funcional)],
    D.XTNDPRCE AS [Subtotal Linea (Moneda Funcional)],
    D.TAXAMNT AS [IVA Linea (Moneda Funcional)],
    
    -- 3. TOTALES (MONEDA TRANSACCION)
    H.ORSUBTOT AS [Total Neto (Moneda Transaccion)],
    H.ORTDISAM AS [Descuento Comercial (Moneda Transaccion)],
    H.ORTAXAMT AS [Total IVA (Moneda Transaccion)],
    CASE 
        WHEN (H.ORSUBTOT - H.ORTDISAM - H.OTAXTAMT) < 0 THEN 0 
        ELSE (H.ORSUBTOT - H.ORTDISAM - H.OTAXTAMT) 
    END AS [Total Exento (Moneda Transaccion)],
    -- IGTF Simulado: 3% del Total de la Factura (Calculo Teórico coincidente con el formato impreso)
    CAST((H.ORDOCAMT * 0.03) AS DECIMAL(19,5)) AS [IGTF Estimado (Moneda Transaccion)], 
    H.ORDOCAMT AS [Total General (Moneda Transaccion)],

    -- 4. TOTALES (MONEDA FUNCIONAL)
    H.SUBTOTAL AS [Total Neto (Moneda Funcional)],
    H.TRDISAMT AS [Descuento Comercial (Moneda Funcional)],
    H.TAXAMNT AS [Total IVA (Moneda Funcional)],
    CASE 
        WHEN (H.SUBTOTAL - H.TRDISAMT - H.TXBTXAMT) < 0 THEN 0 
        ELSE (H.SUBTOTAL - H.TRDISAMT - H.TXBTXAMT) 
    END AS [Total Exento (Moneda Funcional)],
    -- IGTF Simulado: 3% del Total de la Factura (Calculo Teórico coincidente con el formato impreso)
    CAST((H.DOCAMNT * 0.03) AS DECIMAL(19,5)) AS [IGTF Estimado (Moneda Funcional)], 
    H.DOCAMNT AS [Total General (Moneda Funcional)]
FROM 
    SOP30200 H
INNER JOIN 
    SOP30300 D 
        ON H.SOPNUMBE = D.SOPNUMBE 
        AND H.SOPTYPE = D.SOPTYPE
WHERE 
    H.SOPTYPE IN (3, 4) -- Tipo 3 = Facturas (y ND), Tipo 4 = Notas de Crédito (Devoluciones)
    -- AND H.SOPNUMBE = 'NUMERO_FACTURA_AQUI' -- Descomenta esto para filtrar un documento específico
ORDER BY 
    H.SOPNUMBE, D.LNITMSEQ;