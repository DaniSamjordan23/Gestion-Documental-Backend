import {
  searchCategories,
  searchSubcategories,
  searchDocumentTypes,
  searchDocuments,
  searchFiles,
} from './search.repository.js';

function normalizeQuery(query) {
  if (!query || query.trim() === '') {
    const error = new Error('Debe ingresar un término de búsqueda.');
    error.statusCode = 400;
    throw error;
  }

  const normalizedQuery = query.trim();

  if (normalizedQuery.length < 2) {
    const error = new Error('El término de búsqueda debe tener al menos 2 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return normalizedQuery;
}

export async function searchService(query) {
  const normalizedQuery = normalizeQuery(query);

  const [
    categories,
    subcategories,
    documentTypes,
    documents,
    files,
  ] = await Promise.all([
    searchCategories(normalizedQuery),
    searchSubcategories(normalizedQuery),
    searchDocumentTypes(normalizedQuery),
    searchDocuments(normalizedQuery),
    searchFiles(normalizedQuery),
  ]);

  const data = [
    ...categories,
    ...subcategories,
    ...documentTypes,
    ...documents,
    ...files,
  ];

  return {
    query: normalizedQuery,
    total: data.length,
    data,
  };
}