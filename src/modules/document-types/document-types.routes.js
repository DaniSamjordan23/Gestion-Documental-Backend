import { Router } from 'express';

import {
  getDocumentTypes,
  getDocumentTypeById,
  getDocumentTypesBySubcategory,
  createDocumentType,
  updateDocumentType,
  deleteDocumentType,
} from './document-types.controller.js';

const router = Router();

router.get('/', getDocumentTypes);
router.get('/:id', getDocumentTypeById);
router.post('/', createDocumentType);
router.put('/:id', updateDocumentType);
router.delete('/:id', deleteDocumentType);

export const documentTypesBySubcategoryRouter = Router();

documentTypesBySubcategoryRouter.get(
  '/:subcategoryId/document-types',
  getDocumentTypesBySubcategory
);

export default router;