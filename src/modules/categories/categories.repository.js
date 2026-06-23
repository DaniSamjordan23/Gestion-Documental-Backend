import { pool } from '../../config/database.js';

export async function findAllCategories() {
  const [rows] = await pool.query(`
    SELECT
      id,
      nombre,
      descripcion,
      estado,
      created_at,
      updated_at
    FROM categorias
    WHERE deleted_at IS NULL
    ORDER BY nombre ASC
  `);

  return rows;
}

export async function findCategoryById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      nombre,
      descripcion,
      estado,
      created_at,
      updated_at
    FROM categorias
    WHERE id = ?
      AND deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function createCategory({ nombre, descripcion }) {
  const [result] = await pool.query(
    `
    INSERT INTO categorias (nombre, descripcion)
    VALUES (?, ?)
    `,
    [nombre, descripcion]
  );

  return findCategoryById(result.insertId);
}

export async function updateCategory(id, { nombre, descripcion }) {
  await pool.query(
    `
    UPDATE categorias
    SET
      nombre = ?,
      descripcion = ?
    WHERE id = ?
      AND deleted_at IS NULL
    `,
    [nombre, descripcion, id]
  );

  return findCategoryById(id);
}

export async function deleteCategory(id) {
  const [result] = await pool.query(
    `
    UPDATE categorias
    SET
      estado = 0,
      deleted_at = NOW()
    WHERE id = ?
      AND deleted_at IS NULL
    `,
    [id]
  );

  return result.affectedRows > 0;
}

export async function categoryNameExists(nombre, excludeId = null) {
  let query = `
    SELECT id
    FROM categorias
    WHERE LOWER(nombre) = LOWER(?)
      AND deleted_at IS NULL
  `;

  const params = [nombre];

  if (excludeId) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
}