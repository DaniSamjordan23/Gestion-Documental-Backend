import express from 'express';
import cors from 'cors';

import categoriesRoutes from './modules/categories/categories.routes.js';
import subcategoriesRoutes, {
  subcategoriesByCategoryRouter,
} from './modules/subcategories/subcategories.routes.js';
import documentTypesRoutes, {
  documentTypesBySubcategoryRouter,
} from './modules/document-types/document-types.routes.js';
import documentsRoutes, {
  documentsByDocumentTypeRouter,
} from './modules/documents/documents.routes.js';
import filesRoutes, {
  filesByDocumentRouter,
} from './modules/files/files.routes.js';
import searchRoutes from './modules/search/search.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Gestión Documental funcionando.',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    service: 'gestion-documental-backend',
  });
});

app.use('/api/categories', categoriesRoutes);
app.use('/api/subcategories', subcategoriesRoutes);
app.use('/api/categories', subcategoriesByCategoryRouter);

app.use('/api/document-types', documentTypesRoutes);
app.use('/api/subcategories', documentTypesBySubcategoryRouter);

app.use('/api/documents', documentsRoutes);
app.use('/api/document-types', documentsByDocumentTypeRouter);

app.use('/api/files', filesRoutes);
app.use('/api/documents', filesByDocumentRouter);

app.use('/api/search', searchRoutes);

export default app;