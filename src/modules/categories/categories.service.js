import {
  findAllCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryNameExists,
} from './categories.repository.js';

function validarId(id) {
  const parsedId = Number(id);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    const error = new Error('El ID de la categoría no es válido.');
    error.statusCode = 400;
    throw error;
  }

  return parsedId;
}

function validarNombre(nombre) {
  if (!nombre || nombre.trim() === '') {
    const error = new Error('El nombre de la categoría es obligatorio.');
    error.statusCode = 400;
    throw error;
  }

  if (nombre.trim().length > 150) {
    const error = new Error('El nombre de la categoría no debe superar los 150 caracteres.');
    error.statusCode = 400;
    throw error;
  }

  return nombre.trim();
}

export async function getCategoriesService() {
  return findAllCategories();
}

export async function getCategoryByIdService(id) {
  const categoryId = validarId(id);

  const category = await findCategoryById(categoryId);

  if (!category) {
    const error = new Error('Categoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  return category;
}

export async function createCategoryService(data) {
  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const exists = await categoryNameExists(nombre);

  if (exists) {
    const error = new Error('Ya existe una categoría con ese nombre.');
    error.statusCode = 409;
    throw error;
  }

  return createCategory({
    nombre,
    descripcion,
  });
}

export async function updateCategoryService(id, data) {
  const categoryId = validarId(id);

  const currentCategory = await findCategoryById(categoryId);

  if (!currentCategory) {
    const error = new Error('Categoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  const nombre = validarNombre(data.nombre);
  const descripcion = data.descripcion?.trim() || null;

  const exists = await categoryNameExists(nombre, categoryId);

  if (exists) {
    const error = new Error('Ya existe otra categoría con ese nombre.');
    error.statusCode = 409;
    throw error;
  }

  return updateCategory(categoryId, {
    nombre,
    descripcion,
  });
}

export async function deleteCategoryService(id) {
  const categoryId = validarId(id);

  const currentCategory = await findCategoryById(categoryId);

  if (!currentCategory) {
    const error = new Error('Categoría no encontrada.');
    error.statusCode = 404;
    throw error;
  }

  await deleteCategory(categoryId);

  return true;
}