import { pool } from '../../config/database.js';

export async function findAllFiles() {
  const [rows] = await pool.query(`
    SELECT
      a.id,
      a.documento_id,
      a.nombre_original,
      a.nombre_guardado,
      a.ruta_archivo,
      a.tipo_archivo,
      a.extension,
      a.tamano_archivo,
      a.estado,
      a.created_at,
      a.updated_at,
      d.codigo AS documento_codigo,
      d.nombre AS documento_nombre,
      t.id AS tipo_documento_id,
      t.nombre AS tipo_documento_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM archivos a
    INNER JOIN documentos d ON d.id = a.documento_id
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE a.deleted_at IS NULL
      AND d.deleted_at IS NULL
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
    ORDER BY a.created_at DESC
  `);

  return rows;
}

export async function findFileById(id) {
  const [rows] = await pool.query(
    `
    SELECT
      a.id,
      a.documento_id,
      a.nombre_original,
      a.nombre_guardado,
      a.ruta_archivo,
      a.tipo_archivo,
      a.extension,
      a.tamano_archivo,
      a.estado,
      a.created_at,
      a.updated_at,
      d.codigo AS documento_codigo,
      d.nombre AS documento_nombre,
      t.id AS tipo_documento_id,
      t.nombre AS tipo_documento_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM archivos a
    INNER JOIN documentos d ON d.id = a.documento_id
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE a.id = ?
      AND a.deleted_at IS NULL
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

export async function findFilesByDocumentId(documentId) {
  const [rows] = await pool.query(
    `
    SELECT
      a.id,
      a.documento_id,
      a.nombre_original,
      a.nombre_guardado,
      a.ruta_archivo,
      a.tipo_archivo,
      a.extension,
      a.tamano_archivo,
      a.estado,
      a.created_at,
      a.updated_at,
      d.codigo AS documento_codigo,
      d.nombre AS documento_nombre
    FROM archivos a
    INNER JOIN documentos d ON d.id = a.documento_id
    WHERE a.documento_id = ?
      AND a.deleted_at IS NULL
      AND d.deleted_at IS NULL
    ORDER BY a.created_at DESC
    `,
    [documentId]
  );

  return rows;
}

export async function createFile({
  documentoId,
  nombreOriginal,
  nombreGuardado,
  rutaArchivo,
  tipoArchivo,
  extension,
  tamanoArchivo,
}) {
  const [result] = await pool.query(
    `
    INSERT INTO archivos (
      documento_id,
      nombre_original,
      nombre_guardado,
      ruta_archivo,
      tipo_archivo,
      extension,
      tamano_archivo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      documentoId,
      nombreOriginal,
      nombreGuardado,
      rutaArchivo,
      tipoArchivo,
      extension,
      tamanoArchivo,
    ]
  );

  return findFileById(result.insertId);
}

export async function deleteFile(id) {
  const [result] = await pool.query(
    `
    UPDATE archivos
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