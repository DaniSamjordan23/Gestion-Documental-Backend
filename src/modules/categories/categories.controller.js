import {
  getCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
} from './categories.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function getCategories(req, res) {
  try {
    const categories = await getCategoriesService();

    return res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getCategoryById(req, res) {
  try {
    const category = await getCategoryByIdService(req.params.id);

    return res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createCategory(req, res) {
  try {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Categoría creada correctamente.',
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateCategory(req, res) {
  try {
    const category = await updateCategoryService(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Categoría actualizada correctamente.',
      data: category,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteCategory(req, res) {
  try {
    await deleteCategoryService(req.params.id);

    return res.json({
      success: true,
      message: 'Categoría eliminada correctamente.',
    });
  } catch (error) {
    return handleError(res, error);
  }
}