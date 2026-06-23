import {
  getSubcategoriesService,
  getSubcategoryByIdService,
  getSubcategoriesByCategoryService,
  createSubcategoryService,
  updateSubcategoryService,
  deleteSubcategoryService,
} from './subcategories.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function getSubcategories(req, res) {
  try {
    const subcategories = await getSubcategoriesService();

    return res.json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getSubcategoryById(req, res) {
  try {
    const subcategory = await getSubcategoryByIdService(req.params.id);

    return res.json({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function getSubcategoriesByCategory(req, res) {
  try {
    const subcategories = await getSubcategoriesByCategoryService(req.params.categoryId);

    return res.json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function createSubcategory(req, res) {
  try {
    const subcategory = await createSubcategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: 'Subcategoría creada correctamente.',
      data: subcategory,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function updateSubcategory(req, res) {
  try {
    const subcategory = await updateSubcategoryService(req.params.id, req.body);

    return res.json({
      success: true,
      message: 'Subcategoría actualizada correctamente.',
      data: subcategory,
    });
  } catch (error) {
    return handleError(res, error);
  }
}

export async function deleteSubcategory(req, res) {
  try {
    await deleteSubcategoryService(req.params.id);

    return res.json({
      success: true,
      message: 'Subcategoría eliminada correctamente.',
    });
  } catch (error) {
    return handleError(res, error);
  }
}