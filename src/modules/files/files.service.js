import fs from 'fs';
import path from 'path';

import { findDocumentById } from '../documents/documents.repository.js';

import {
  findAllFiles,
  findFileById,
  findFilesByDocumentId,
  createFile,
  deleteFile,
} from './files.repository.js';

function validarId(id, nombreCampo = 'id') {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error(`El campo ${nombreCampo} no es válido.`);
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
}

export async function getFilesService() {
  return findAllFiles();
}

export async function getFileByIdService(id) {
  const fileId = validarId(id);

  const file = await findFileById(fileId);

  if (!file) {
    const error = new Error('Archivo no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return file;
}

export async function getFilesByDocumentService(documentId) {
  const parsedDocumentId = validarId(documentId, 'documentId');

  const document = await findDocumentById(parsedDocumentId);

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return findFilesByDocumentId(parsedDocumentId);
}

export async function uploadFileService(documentId, file) {
  const parsedDocumentId = validarId(documentId, 'documentId');

  const document = await findDocumentById(parsedDocumentId);

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  if (!file) {
    const error = new Error('Debe seleccionar un archivo.');
    error.statusCode = 400;
    throw error;
  }

  const extension = path.extname(file.originalname).replace('.', '').toLowerCase();

  const relativePath = path
    .relative(process.cwd(), file.path)
    .replace(/\\/g, '/');

  return createFile({
    documentoId: parsedDocumentId,
    nombreOriginal: file.originalname,
    nombreGuardado: file.filename,
    rutaArchivo: relativePath,
    tipoArchivo: file.mimetype,
    extension,
    tamanoArchivo: file.size,
  });
}

export async function downloadFileService(id) {
  const file = await getFileByIdService(id);

  const absolutePath = path.isAbsolute(file.ruta_archivo)
    ? file.ruta_archivo
    : path.join(process.cwd(), file.ruta_archivo);

  if (!fs.existsSync(absolutePath)) {
    const error = new Error('El archivo físico no existe en el servidor.');
    error.statusCode = 404;
    throw error;
  }

  return {
    file,
    absolutePath,
  };
}

export async function deleteFileService(id) {
  const fileId = validarId(id);

  const file = await findFileById(fileId);

  if (!file) {
    const error = new Error('Archivo no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await deleteFile(fileId);

  return true;
}