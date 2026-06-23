import { pool } from '../../config/database.js';

export async function findAllDocumentTypes() {
  const [rows] = await pool.query(`
    SELECT
      t.id,
      t.subcategoria_id,
      t.nombre,
      t.descripcion,
      t.estado,
      t.created_at,
      t.updated_at,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM tipos_documento t
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY c.nombre ASC, s.nombre ASC, t.nombre ASC
  `);

  return rows;
}

export async function findDocumentTypeById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      t.id,
      t.subcategoria_id,
      t.nombre,
      t.descripcion,
      t.estado,
      t.created_at,
      t.updated_at,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM tipos_documento t
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE t.id = ?
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function findDocumentTypesBySubcategoryId(subcategoryId) {
  const [rows] = await pool.query(
    `
    SELECT
      t.id,
      t.subcategoria_id,
      t.nombre,
      t.descripcion,
      t.estado,
      t.created_at,
      t.updated_at,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM tipos_documento t
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE t.subcategoria_id = ?
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY t.nombre ASC
    `,
    [subcategoryId]
  );

  return rows;
}

export async function createDocumentType({ subcategoriaId, nombre, descripcion }) {
  const [result] = await pool.query(
    `
    INSERT INTO tipos_documento (
      subcategoria_id,
      nombre,
      descripcion
    )
    VALUES (?, ?, ?)
    `,
    [subcategoriaId, nombre, descripcion]
  );

  return findDocumentTypeById(result.insertId);
}

export async function updateDocumentType(id, { subcategoriaId, nombre, descripcion }) {
  await pool.query(
    `
    UPDATE tipos_documento
    SET
      subcategoria_id = ?,
      nombre = ?,
      descripcion = ?
    WHERE id = ?
      AND deleted_at IS NULL
    `,
    [subcategoriaId, nombre, descripcion, id]
  );

  return findDocumentTypeById(id);
}

export async function deleteDocumentType(id) {
  const [result] = await pool.query(
    `
    UPDATE tipos_documento
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

export async function documentTypeNameExists(subcategoriaId, nombre, excludeId = null) {
  let query = `
    SELECT id
    FROM tipos_documento
    WHERE subcategoria_id = ?
      AND LOWER(nombre) = LOWER(?)
      AND deleted_at IS NULL
  `;

  const params = [subcategoriaId, nombre];

  if (excludeId) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
}