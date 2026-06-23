import { searchService } from './search.service.js';

function handleError(res, error) {
  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || 'Error interno del servidor.',
  });
}

export async function search(req, res) {
  try {
    const result = await searchService(req.query.query);

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return handleError(res, error);
  }
}