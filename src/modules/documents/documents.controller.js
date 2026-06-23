import {
  getDocumentsService,
  getDocumentByIdService,
  getDocumentsByDocumentTypeService,
  createDocumentService,
  updateDocumentService,
  deleteDocumentService,
} from './documents.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function getDocuments(req, res) {
  try {
    const documents = await getDocumentsService();

    return res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getDocumentById(req, res) {
  try {
    const document = await getDocumentByIdService(req.params.id);

    return res.json({
      success: true,
      data: document,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getDocumentsByDocumentType(req, res) {
  try {
    const documents = await getDocumentsByDocumentTypeService(
      req.params.documentTypeId
    );

    return res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createDocument(req, res) {
  try {
    const document = await createDocumentService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Documento creado correctamente.',
      data: document,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateDocument(req, res) {
  try {
    const document = await updateDocumentService(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Documento actualizado correctamente.',
      data: document,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteDocument(req, res) {
  try {
    await deleteDocumentService(req.params.id);

    return res.json({
      success: true,
      message: 'Documento eliminado correctamente.',
    });
  } catch (error) {
    return handleError(res, error);
  }
}