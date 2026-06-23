import {
  getFilesService,
  getFileByIdService,
  getFilesByDocumentService,
  uploadFileService,
  downloadFileService,
  deleteFileService,
} from './files.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function getFiles(req, res) {
  try {
    const files = await getFilesService();

    return res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getFileById(req, res) {
  try {
    const file = await getFileByIdService(req.params.id);

    return res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getFilesByDocument(req, res) {
  try {
    const files = await getFilesByDocumentService(req.params.documentId);

    return res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function uploadFile(req, res) {
  try {
    const file = await uploadFileService(req.params.documentId, req.file);

    return res.status(201).json({
      success: true,
      message: 'Archivo subido correctamente.',
      data: file,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function downloadFile(req, res) {
  try {
    const { file, absolutePath } = await downloadFileService(req.params.id);

    return res.download(absolutePath, file.nombre_original);
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteFile(req, res) {
  try {
    await deleteFileService(req.params.id);

    return res.json({
      success: true,
      message: 'Archivo eliminado correctamente.',
    });
  } catch (error) {
    return handleError(res, error);
  }
}