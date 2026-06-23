import { findDocumentTypeById } from '../document-types/document-types.repository.js';

import {
  findAllDocuments,
  findDocumentById,
  findDocumentsByDocumentTypeId,
  createDocument,
  updateDocument,
  deleteDocument,
  documentCodeExists,
  documentNameExistsInType,
} from './documents.repository.js';

function validarId(id, nombreCampo = 'id') {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error(`El campo ${nombreCampo} no es válido.`);
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
}

function validarTextoObligatorio(valor, mensaje, maxLength = 255) {
  if (!valor || valor.trim() === '') {
    const error = new Error(mensaje);
    error.statusCode = 400;
    throw error;
  }

  if (valor.trim().length > maxLength) {
    const error = new Error(`El valor no debe superar los ${maxLength} caracteres.`);
    error.statusCode = 400;
    throw error;
  }

  return valor.trim();
}

function validarVersion(version) {
  if (!version || version.trim() === '') {
    return '1';
  }

  if (version.trim().length > 50) {
    const error = new Error('La versión no debe superar los 50 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return version.trim();
}

export async function getDocumentsService() {
  return findAllDocuments();
}

export async function getDocumentByIdService(id) {
  const documentId = validarId(id);

  const document = await findDocumentById(documentId);

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return document;
}

export async function getDocumentsByDocumentTypeService(documentTypeId) {
  const parsedDocumentTypeId = validarId(documentTypeId, 'documentTypeId');

  const documentType = await findDocumentTypeById(parsedDocumentTypeId);

  if (!documentType) {
    const error = new Error('Tipo de documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return findDocumentsByDocumentTypeId(parsedDocumentTypeId);
}

export async function createDocumentService(data) {
  const tipoDocumentoId = validarId(data.tipo_documento_id, 'tipo_documento_id');

  const codigo = validarTextoObligatorio(
    data.codigo,
    'El código del documento es obligatorio.',
    100
  );

  const nombre = validarTextoObligatorio(
    data.nombre,
    'El nombre del documento es obligatorio.',
    255
  );

  const version = validarVersion(data.version);
  const descripcion = data.descripcion?.trim() || null;

  const documentType = await findDocumentTypeById(tipoDocumentoId);

  if (!documentType) {
    const error = new Error('El tipo de documento seleccionado no existe.');
    error.statusCode = 404;
    throw error;
  }

  const codeExists = await documentCodeExists(codigo);

  if (codeExists) {
    const error = new Error('Ya existe un documento con ese código.');
    error.statusCode = 409;
    throw error;
  }

  const nameExists = await documentNameExistsInType(tipoDocumentoId, nombre);

  if (nameExists) {
    const error = new Error('Ya existe un documento con ese nombre dentro de este tipo de documento.');
    error.statusCode = 409;
    throw error;
  }

  return createDocument({
    tipoDocumentoId,
    codigo,
    nombre,
    version,
    descripcion,
  });
}

export async function updateDocumentService(id, data) {
  const documentId = validarId(id);
  const tipoDocumentoId = validarId(data.tipo_documento_id, 'tipo_documento_id');

  const codigo = validarTextoObligatorio(
    data.codigo,
    'El código del documento es obligatorio.',
    100
  );

  const nombre = validarTextoObligatorio(
    data.nombre,
    'El nombre del documento es obligatorio.',
    255
  );

  const version = validarVersion(data.version);
  const descripcion = data.descripcion?.trim() || null;

  const document = await findDocumentById(documentId);

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const documentType = await findDocumentTypeById(tipoDocumentoId);

  if (!documentType) {
    const error = new Error('El tipo de documento seleccionado no existe.');
    error.statusCode = 404;
    throw error;
  }

  const codeExists = await documentCodeExists(codigo, documentId);

  if (codeExists) {
    const error = new Error('Ya existe otro documento con ese código.');
    error.statusCode = 409;
    throw error;
  }

  const nameExists = await documentNameExistsInType(tipoDocumentoId, nombre, documentId);

  if (nameExists) {
    const error = new Error('Ya existe otro documento con ese nombre dentro de este tipo de documento.');
    error.statusCode = 409;
    throw error;
  }

  return updateDocument(documentId, {
    tipoDocumentoId,
    codigo,
    nombre,
    version,
    descripcion,
  });
}

export async function deleteDocumentService(id) {
  const documentId = validarId(id);

  const document = await findDocumentById(documentId);

  if (!document) {
    const error = new Error('Documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await deleteDocument(documentId);

  return true;
}