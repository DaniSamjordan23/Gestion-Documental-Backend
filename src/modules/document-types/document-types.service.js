import { findSubcategoryById } from '../subcategories/subcategories.repository.js';

import {
  findAllDocumentTypes,
  findDocumentTypeById,
  findDocumentTypesBySubcategoryId,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
  documentTypeNameExists,
} from './document-types.repository.js';

function validarId(id, nombreCampo = 'id') {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error(`El campo ${nombreCampo} no es válido.`);
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
}

function validarNombre(nombre) {
  if (!nombre || nombre.trim() === '') {
    const error = new Error('El nombre del tipo de documento es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (nombre.trim().length > 150) {
    const error = new Error('El nombre del tipo de documento no debe superar los 150 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return nombre.trim();
}

export async function getDocumentTypesService() {
  return findAllDocumentTypes();
}

export async function getDocumentTypeByIdService(id) {
  const documentTypeId = validarId(id);

  const documentType = await findDocumentTypeById(documentTypeId);

  if (!documentType) {
    const error = new Error('Tipo de documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  return documentType;
}

export async function getDocumentTypesBySubcategoryService(subcategoryId) {
  const parsedSubcategoryId = validarId(subcategoryId, 'subcategoryId');

  const subcategory = await findSubcategoryById(parsedSubcategoryId);

  if (!subcategory) {
    const error = new Error('Subcategoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return findDocumentTypesBySubcategoryId(parsedSubcategoryId);
}

export async function createDocumentTypeService(data) {
  const subcategoriaId = validarId(data.subcategoria_id, 'subcategoria_id');
  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const subcategory = await findSubcategoryById(subcategoriaId);

  if (!subcategory) {
    const error = new Error('La subcategoría seleccionada no existe.');
    error.statusCode = 404;
    throw error;
  }

  const exists = await documentTypeNameExists(subcategoriaId, nombre);

  if (exists) {
    const error = new Error('Ya existe un tipo de documento con ese nombre dentro de esta subcategoría.');
    error.statusCode = 409;
    throw error;
  }

  return createDocumentType({
    subcategoriaId,
    nombre,
    descripcion,
  });
}

export async function updateDocumentTypeService(id, data) {
  const documentTypeId = validarId(id);
  const subcategoriaId = validarId(data.subcategoria_id, 'subcategoria_id');
  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const documentType = await findDocumentTypeById(documentTypeId);

  if (!documentType) {
    const error = new Error('Tipo de documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  const subcategory = await findSubcategoryById(subcategoriaId);

  if (!subcategory) {
    const error = new Error('La subcategoría seleccionada no existe.');
    error.statusCode = 404;
    throw error;
  }

  const exists = await documentTypeNameExists(subcategoriaId, nombre, documentTypeId);

  if (exists) {
    const error = new Error('Ya existe otro tipo de documento con ese nombre dentro de esta subcategoría.');
    error.statusCode = 409;
    throw error;
  }

  return updateDocumentType(documentTypeId, {
    subcategoriaId,
    nombre,
    descripcion,
  });
}

export async function deleteDocumentTypeService(id) {
  const documentTypeId = validarId(id);

  const documentType = await findDocumentTypeById(documentTypeId);

  if (!documentType) {
    const error = new Error('Tipo de documento no encontrado.');
    error.statusCode = 404;
    throw error;
  }

  await deleteDocumentType(documentTypeId);

  return true;
}