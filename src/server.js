import app from './app.js';
import { pool } from './config/database.js';

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    const connection = await pool.getConnection();

    console.log('Conexión a MySQL exitosa.');

    connection.release();

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error conectando a MySQL:', error.message);
    process.exit(1);
  }
}

startServer();