import {
  getDocumentTypesService,
  getDocumentTypeByIdService,
  getDocumentTypesBySubcategoryService,
  createDocumentTypeService,
  updateDocumentTypeService,
  deleteDocumentTypeService,
} from './document-types.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function getDocumentTypes(req, res) {
  try {
    const documentTypes = await getDocumentTypesService();

    return res.json({
      success: true,
      data: documentTypes,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getDocumentTypeById(req, res) {
  try {
    const documentType = await getDocumentTypeByIdService(req.params.id);

    return res.json({
      success: true,
      data: documentType,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getDocumentTypesBySubcategory(req, res) {
  try {
    const documentTypes = await getDocumentTypesBySubcategoryService(
      req.params.subcategoryId
    );

    return res.json({
      success: true,
      data: documentTypes,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createDocumentType(req, res) {
  try {
    const documentType = await createDocumentTypeService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Tipo de documento creado correctamente.',
      data: documentType,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateDocumentType(req, res) {
  try {
    const documentType = await updateDocumentTypeService(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Tipo de documento actualizado correctamente.',
      data: documentType,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteDocumentType(req, res) {
  try {
    await deleteDocumentTypeService(req.params.id);

    return res.json({
      success: true,
      message: 'Tipo de documento eliminado correctamente.',
    });
  } catch (error) {
    return handleError(res, error);
  }
}