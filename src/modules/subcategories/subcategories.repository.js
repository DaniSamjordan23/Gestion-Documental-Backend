import { pool } from '../../config/database.js';

export async function findAllSubcategories() {
  const [rows] = await pool.query(`
    SELECT
      s.id,
      s.categoria_id,
      s.nombre,
      s.descripcion,
      s.estado,
      s.created_at,
      s.updated_at,
      c.nombre AS categoria_nombre
    FROM subcategorias s
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY c.nombre ASC, s.nombre ASC
  `);

  return rows;
}

export async function findSubcategoryById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      s.id,
      s.categoria_id,
      s.nombre,
      s.descripcion,
      s.estado,
      s.created_at,
      s.updated_at,
      c.nombre AS categoria_nombre
    FROM subcategorias s
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE s.id = ?
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function findSubcategoriesByCategoryId(categoryId) {
  const [rows] = await pool.query(
    `
    SELECT
      s.id,
      s.categoria_id,
      s.nombre,
      s.descripcion,
      s.estado,
      s.created_at,
      s.updated_at,
      c.nombre AS categoria_nombre
    FROM subcategorias s
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE s.categoria_id = ?
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY s.nombre ASC
    `,
    [categoryId]
  );

  return rows;
}

export async function createSubcategory({ categoriaId, nombre, descripcion }) {
  const [result] = await pool.query(
    `
    INSERT INTO subcategorias (
      categoria_id,
      nombre,
      descripcion
    )
    VALUES (?, ?, ?)
    `,
    [categoriaId, nombre, descripcion]
  );

  return findSubcategoryById(result.insertId);
}

export async function updateSubcategory(id, { categoriaId, nombre, descripcion }) {
  await pool.query(
    `
    UPDATE subcategorias
    SET
      categoria_id = ?,
      nombre = ?,
      descripcion = ?
    WHERE id = ?
      AND deleted_at IS NULL
    `,
    [categoriaId, nombre, descripcion, id]
  );

  return findSubcategoryById(id);
}

export async function deleteSubcategory(id) {
  const [result] = await pool.query(
    `
    UPDATE subcategorias
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

export async function subcategoryNameExists(categoriaId, nombre, excludeId = null) {
  let query = `
    SELECT id
    FROM subcategorias
    WHERE categoria_id = ?
      AND LOWER(nombre) = LOWER(?)
      AND deleted_at IS NULL
  `;

  const params = [categoriaId, nombre];

  if (excludeId) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
}