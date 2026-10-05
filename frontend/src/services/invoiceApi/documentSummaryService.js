const DOCUMENTS_API_URL = (import.meta.env.VITE_DOCUMENTS_API_URL || 'http://localhost:8080/api').replace(/\/$/, '');

const getErrorMessage = async (response) => {
  try {
    const body = await response.json();
    return body.message || `La API de documentos respondió ${response.status}.`;
  } catch {
    return `La API de documentos respondió ${response.status}.`;
  }
};

export const documentSummaryService = {
  async list({ page = 1, perPage = 10 } = {}) {
    let response;
    try {
      response = await fetch(`${DOCUMENTS_API_URL}/documents/summary?page=${page}&per_page=${perPage}`, {
        headers: { Accept: 'application/json' },
      });
    } catch {
      throw new Error(`No se pudo conectar con la API de documentos (${DOCUMENTS_API_URL}).`);
    }

    if (!response.ok) throw new Error(await getErrorMessage(response));

    const body = await response.json();
    return body?.data?.items ?? [];
  },

  async getDetails(documentNumber) {
    const number = String(documentNumber ?? '').trim();
    if (!number) throw new Error('El número de documento es obligatorio.');

    let response;
    try {
      response = await fetch(`${DOCUMENTS_API_URL}/documents/${encodeURIComponent(number)}/details`, {
        headers: { Accept: 'application/json' },
      });
    } catch {
      throw new Error(`No se pudo conectar con la API de documentos (${DOCUMENTS_API_URL}).`);
    }

    if (!response.ok) throw new Error(await getErrorMessage(response));

    const body = await response.json();
    if (!body?.data) throw new Error('La API no devolvió los detalles del documento.');
    return body;
  },
};