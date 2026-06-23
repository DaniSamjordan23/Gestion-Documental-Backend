import { findCategoryById } from '../categories/categories.repository.js';

import {
  findAllSubcategories,
  findSubcategoryById,
  findSubcategoriesByCategoryId,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  subcategoryNameExists,
} from './subcategories.repository.js';

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
    const error = new Error('El nombre de la subcategoría es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (nombre.trim().length > 150) {
    const error = new Error('El nombre de la subcategoría no debe superar los 150 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return nombre.trim();
}

export async function getSubcategoriesService() {
  return findAllSubcategories();
}

export async function getSubcategoryByIdService(id) {
  const subcategoryId = validarId(id);

  const subcategory = await findSubcategoryById(subcategoryId);

  if (!subcategory) {
    const error = new Error('Subcategoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return subcategory;
}

export async function getSubcategoriesByCategoryService(categoryId) {
  const parsedCategoryId = validarId(categoryId, 'categoryId');

  const category = await findCategoryById(parsedCategoryId);

  if (!category) {
    const error = new Error('Categoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return findSubcategoriesByCategoryId(parsedCategoryId);
}

export async function createSubcategoryService(data) {
  const categoriaId = validarId(data.categoria_id, 'categoria_id');
  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const category = await findCategoryById(categoriaId);

  if (!category) {
    const error = new Error('La categoría seleccionada no existe.');
    error.statusCode = 404;
    throw error;
  }

  const exists = await subcategoryNameExists(categoriaId, nombre);

  if (exists) {
    const error = new Error('Ya existe una subcategoría con ese nombre dentro de esta categoría.');
    error.statusCode = 409;
    throw error;
  }

  return createSubcategory({
    categoriaId,
    nombre,
    descripcion,
  });
}

export async function updateSubcategoryService(id, data) {
  const subcategoryId = validarId(id);
  const categoriaId = validarId(data.categoria_id, 'categoria_id');
  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const subcategory = await findSubcategoryById(subcategoryId);

  if (!subcategory) {
    const error = new Error('Subcategoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  const category = await findCategoryById(categoriaId);

  if (!category) {
    const error = new Error('La categoría seleccionada no existe.');
    error.statusCode = 404;
    throw error;
  }

  const exists = await subcategoryNameExists(categoriaId, nombre, subcategoryId);

  if (exists) {
    const error = new Error('Ya existe otra subcategoría con ese nombre dentro de esta categoría.');
    error.statusCode = 409;
    throw error;
  }

  return updateSubcategory(subcategoryId, {
    categoriaId,
    nombre,
    descripcion,
  });
}

export async function deleteSubcategoryService(id) {
  const subcategoryId = validarId(id);

  const subcategory = await findSubcategoryById(subcategoryId);

  if (!subcategory) {
    const error = new Error('Subcategoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  await deleteSubcategory(subcategoryId);

  return true;
}