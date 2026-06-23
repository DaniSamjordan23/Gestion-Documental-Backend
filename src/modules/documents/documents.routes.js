import { Router } from 'express';

import {
  getDocuments,
  getDocumentById,
  getDocumentsByDocumentType,
  createDocument,
  updateDocument,
  deleteDocument,
} from './documents.controller.js';

const router = Router();

router.get('/', getDocuments);
router.get('/:id', getDocumentById);
router.post('/', createDocument);
router.put('/:id', updateDocument);
router.delete('/:id', deleteDocument);

export const documentsByDocumentTypeRouter = Router();

documentsByDocumentTypeRouter.get(
  '/:documentTypeId/documents',
  getDocumentsByDocumentType
);

export default router;