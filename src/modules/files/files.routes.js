import { Router } from 'express';

import { uploadFile as uploadMiddleware } from './files.upload.js';

import {
  getFiles,
  getFileById,
  getFilesByDocument,
  uploadFile,
  downloadFile,
  deleteFile,
} from './files.controller.js';

const router = Router();

router.get('/', getFiles);
router.get('/:id/download', downloadFile);
router.get('/:id', getFileById);
router.delete('/:id', deleteFile);

export const filesByDocumentRouter = Router();

filesByDocumentRouter.get('/:documentId/files', getFilesByDocument);

filesByDocumentRouter.post(
  '/:documentId/files',
  (req, res, next) => {
    uploadMiddleware.single('archivo')(req, res, (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next();
    });
  },
  uploadFile
);

export default router;