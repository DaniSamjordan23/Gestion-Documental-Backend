import { Router } from 'express';

import {
  getSubcategories,
  getSubcategoryById,
  getSubcategoriesByCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
} from './subcategories.controller.js';

const router = Router();

router.get('/', getSubcategories);
router.get('/:id', getSubcategoryById);
router.post('/', createSubcategory);
router.put('/:id', updateSubcategory);
router.delete('/:id', deleteSubcategory);

export const subcategoriesByCategoryRouter = Router();

subcategoriesByCategoryRouter.get(
  '/:categoryId/subcategories',
  getSubcategoriesByCategory
);

export default router;