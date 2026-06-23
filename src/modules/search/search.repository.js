import { pool } from '../../config/database.js';

export async function searchCategories(query) {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      'categoria' AS tipo,
      c.id,
      c.nombre,
      c.descripcion,
      c.nombre AS ruta
    FROM categorias c
    WHERE c.deleted_at IS NULL
      AND (
        c.nombre LIKE ?
        OR c.descripcion LIKE ?
      )
    ORDER BY c.nombre ASC
    `,
    [like, like]
  );

  return rows;
}

export async function searchSubcategories(query) {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      'subcategoria' AS tipo,
      s.id,
      s.nombre,
      s.descripcion,
      CONCAT(c.nombre, ' / ', s.nombre) AS ruta,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre
    FROM subcategorias s
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE s.deleted_at IS NULL
      AND c.deleted_at IS NULL
      AND (
        s.nombre LIKE ?
        OR s.descripcion LIKE ?
        OR c.nombre LIKE ?
      )
    ORDER BY c.nombre ASC, s.nombre ASC
    `,
    [like, like, like]
  );

  return rows;
}

export async function searchDocumentTypes(query) {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      'tipo_documento' AS tipo,
      t.id,
      t.nombre,
      t.descripcion,
      CONCAT(c.nombre, ' / ', s.nombre, ' / ', t.nombre) AS ruta,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre
    FROM tipos_documento t
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
      AND (
        t.nombre LIKE ?
        OR t.descripcion LIKE ?
        OR s.nombre LIKE ?
        OR c.nombre LIKE ?
      )
    ORDER BY c.nombre ASC, s.nombre ASC, t.nombre ASC
    `,
    [like, like, like, like]
  );

  return rows;
}

export async function searchDocuments(query) {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      'documento' AS tipo,
      d.id,
      d.nombre,
      d.descripcion,
      d.codigo,
      d.version,
      CONCAT(c.nombre, ' / ', s.nombre, ' / ', t.nombre, ' / ', d.nombre) AS ruta,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      t.id AS tipo_documento_id,
      t.nombre AS tipo_documento_nombre
    FROM documentos d
    INNER JOIN tipos_documento t ON t.id = d.tipo_documento_id
    INNER JOIN subcategorias s ON s.id = t.subcategoria_id
    INNER JOIN categorias c ON c.id = s.categoria_id
    WHERE d.deleted_at IS NULL
      AND t.deleted_at IS NULL
      AND s.deleted_at IS NULL
      AND c.deleted_at IS NULL
      AND (
        d.nombre LIKE ?
        OR d.codigo LIKE ?
        OR d.descripcion LIKE ?
        OR t.nombre LIKE ?
        OR s.nombre LIKE ?
        OR c.nombre LIKE ?
      )
    ORDER BY c.nombre ASC, s.nombre ASC, t.nombre ASC, d.nombre ASC
    `,
    [like, like, like, like, like, like]
  );

  return rows;
}

export async function searchFiles(query) {
  const like = `%${query}%`;

  const [rows] = await pool.query(
    `
    SELECT
      'archivo' AS tipo,
      a.id,
      a.nombre_original AS nombre,
      a.tipo_archivo,
      a.extension,
      a.tamano_archivo,
      CONCAT(
        c.nombre,
        ' / ',
        s.nombre,
        ' / ',
        t.nombre,
        ' / ',
        d.nombre,
        ' / ',
        a.nombre_original
      ) AS ruta,
      c.id AS categoria_id,
      c.nombre AS categoria_nombre,
      s.id AS subcategoria_id,
      s.nombre AS subcategoria_nombre,
      t.id AS tipo_documento_id,
      t.nombre AS tipo_documento_nombre,
      d.id AS documento_id,
      d.nombre AS documento_nombre
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
      AND (
        a.nombre_original LIKE ?
        OR a.nombre_guardado LIKE ?
        OR a.extension LIKE ?
        OR d.nombre LIKE ?
        OR d.codigo LIKE ?
        OR t.nombre LIKE ?
        OR s.nombre LIKE ?
        OR c.nombre LIKE ?
      )
    ORDER BY c.nombre ASC, s.nombre ASC, t.nombre ASC, d.nombre ASC, a.nombre_original ASC
    `,
    [like, like, like, like, like, like, like, like]
  );

  return rows;
}