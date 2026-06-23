import { pool } from '../../config/database.js';

export async function findAllDocuments() {
  const [rows] = await pool.query(`
    SELECT
      d.id,
      d.tipo_documento_id,
      d.codigo,
      d.nombre,
      d.version,
      d.descripcion,
      d.estado,
      d.created_at,
      d.updated_at,
      t.nombre AS tipo_documento_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM documentos d
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE d.deleted_at IS NULL
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY c.nombre ASC, s.nombre ASC, t.nombre ASC, d.nombre ASC
  `);

  return rows;
}

export async function findDocumentById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      d.id,
      d.tipo_documento_id,
      d.codigo,
      d.nombre,
      d.version,
      d.descripcion,
      d.estado,
      d.created_at,
      d.updated_at,
      t.nombre AS tipo_documento_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM documentos d
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE d.id = ?
      AND d.deleted_at IS NULL
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
}

export async function findDocumentsByDocumentTypeId(documentTypeId) {
  const [rows] = await pool.query(
    `
    SELECT
      d.id,
      d.tipo_documento_id,
      d.codigo,
      d.nombre,
      d.version,
      d.descripcion,
      d.estado,
      d.created_at,
      d.updated_at,
      t.nombre AS tipo_documento_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM documentos d
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE d.tipo_documento_id = ?
      AND d.deleted_at IS NULL
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY d.nombre ASC
    `,
    [documentTypeId]
  );

  return rows;
}

export async function createDocument({
  tipoDocumentoId,
  codigo,
  nombre,
  version,
  descripcion,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO documentos (
      tipo_documento_id,
      codigo,
      nombre,
      version,
      descripcion
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [tipoDocumentoId, codigo, nombre, version, descripcion]
  );

  return findDocumentById(result.insertId);
}

export async function updateDocument(id, {
  tipoDocumentoId,
  codigo,
  nombre,
  version,
  descripcion,
}) {
  await pool.query(
    `
    UPDATE documentos
    SET
      tipo_documento_id = ?,
      codigo = ?,
      nombre = ?,
      version = ?,
      descripcion = ?
    WHERE id = ?
      AND deleted_at IS NULL
    `,
    [tipoDocumentoId, codigo, nombre, version, descripcion, id]
  );

  return findDocumentById(id);
}

export async function deleteDocument(id) {
  const [result] = await pool.query(
    `
    UPDATE documentos
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

export async function documentCodeExists(codigo, excludeId = null) {
  let query = `
    SELECT id
    FROM documentos
    WHERE LOWER(codigo) = LOWER(?)
      AND deleted_at IS NULL
  `;

  const params = [codigo];

  if (excludeId) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
}

export async function documentNameExistsInType(tipoDocumentoId, nombre, excludeId = null) {
  let query = `
    SELECT id
    FROM documentos
    WHERE tipo_documento_id = ?
      AND LOWER(nombre) = LOWER(?)
      AND deleted_at IS NULL
  `;

  const params = [tipoDocumentoId, nombre];

  if (excludeId) {
    query += ` AND id <> ?`;
    params.push(excludeId);
  }

  query += ` LIMIT 1`;

  const [rows] = await pool.query(query, params);

  return rows.length > 0;
}