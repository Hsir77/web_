const db = require("../config/db");

// ----------------------  book_source 表 ----------------------
async function insertBookSource(params) {
  const { name, source, url, book_id, gender } = params;

  const sql = `
    INSERT INTO book_source (
      name, source, url, book_id, gender
    ) VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      name = VALUES(name),
      source = VALUES(source),
      url = VALUES(url),
      gender = VALUES(gender)
  `;
  const [result] = await db.query(sql, [name, source, url, book_id, gender]);
  return { insertId: result.insertId, affectedRows: result.affectedRows };
}

// ----------------------  纵横表（修正所有字段名） ----------------------
async function insertZonghengBookData(data) {
  const {
    book_id, book_name, author_name, book_status, category,
    word_count, book_intro, cover_url,
    total_click, total_recommend, weekly_recommend,
    chapter_count, chapter_catalog,
    chapter1, chapter2, chapter3
  } = data;

  const sql = `
    INSERT INTO zongheng_book_data (
      book_id, book_name, author_name, book_status, category, word_count,
      book_intro, cover_url, total_click, total_recommend, weekly_recommend,
      chapter_count, chapter_catalog, chapter1_content, chapter2_content, chapter3_content
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      book_name = VALUES(book_name),
      author_name = VALUES(author_name),
      book_status = VALUES(book_status),
      category = VALUES(category),
      word_count = VALUES(word_count),
      book_intro = VALUES(book_intro),
      cover_url = VALUES(cover_url),
      total_click = VALUES(total_click),
      total_recommend = VALUES(total_recommend),
      weekly_recommend = VALUES(weekly_recommend),
      chapter_count = VALUES(chapter_count),
      chapter_catalog = VALUES(chapter_catalog),
      chapter1_content = VALUES(chapter1_content),
      chapter2_content = VALUES(chapter2_content),
      chapter3_content = VALUES(chapter3_content)
  `;

  const [result] = await db.query(sql, [
    book_id, book_name, author_name, book_status, category,
    word_count, book_intro, cover_url,
    total_click, total_recommend, weekly_recommend,
    chapter_count, JSON.stringify(chapter_catalog),
    chapter1, chapter2, chapter3
  ]);
  return result;
}

// ----------------------  七猫表（修正所有字段名） ----------------------
async function insertQimaoBookData(data) {
  const {
    book_id, book_name, author_name, book_status, category,
    word_count, read_count, popularity, score,
    book_intro, cover_url,
    chapter_count, chapter_catalog,
    chapter1, chapter2, chapter3
  } = data;

  const sql = `
    INSERT INTO qimao_book_data (
      book_id, book_name, author_name, book_status, category, word_count,
      read_count, popularity, score, book_intro, cover_url,
      chapter_count, chapter_catalog, chapter1_content, chapter2_content, chapter3_content
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      book_name = VALUES(book_name),
      author_name = VALUES(author_name),
      book_status = VALUES(book_status),
      category = VALUES(category),
      word_count = VALUES(word_count),
      read_count = VALUES(read_count),
      popularity = VALUES(popularity),
      score = VALUES(score),
      book_intro = VALUES(book_intro),
      cover_url = VALUES(cover_url),
      chapter_count = VALUES(chapter_count),
      chapter_catalog = VALUES(chapter_catalog),
      chapter1_content = VALUES(chapter1_content),
      chapter2_content = VALUES(chapter2_content),
      chapter3_content = VALUES(chapter3_content)
  `;

  const [result] = await db.query(sql, [
    book_id, book_name, author_name, book_status, category,
    word_count, read_count, popularity, score,
    book_intro, cover_url,
    chapter_count, JSON.stringify(chapter_catalog),
    chapter1, chapter2, chapter3
  ]);
  return result;
}

// ----------------------  书旗表（核心修正：去掉title，用book_name） ----------------------
async function insertShuqiBookData(data) {
  const {
    book_id, book_name, author_name, book_status, category,
    word_count, popularity, book_intro, cover_url,
    chapter_count, chapter_catalog
  } = data;

  const sql = `
    INSERT INTO shuqi_book_data (
      book_id, book_name, author_name, book_status, category, word_count,
      popularity, book_intro, cover_url, chapter_count, chapter_catalog
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?)
    ON DUPLICATE KEY UPDATE
      book_name = VALUES(book_name),
      author_name = VALUES(author_name),
      book_status = VALUES(book_status),
      category = VALUES(category),
      word_count = VALUES(word_count),
      popularity = VALUES(popularity),
      book_intro = VALUES(book_intro),
      cover_url = VALUES(cover_url),
      chapter_count = VALUES(chapter_count),
      chapter_catalog = VALUES(chapter_catalog)
  `;

  const [result] = await db.query(sql, [
    book_id, book_name, author_name, book_status, category,
    word_count, popularity, book_intro, cover_url,
    chapter_count, JSON.stringify(chapter_catalog)
  ]);
  return result;
}

// 删除相关方法
async function findBookBySourceAndUrl(source, url) {
  const [rows] = await db.query(
    'SELECT * FROM book_source WHERE source = ? AND url = ? LIMIT 1',
    [source, url]
  );
  return rows[0] || null;
}

async function findBookBySourceAndName(source, name) {
  const [rows] = await db.query(
    'SELECT * FROM book_source WHERE source = ? AND name = ? LIMIT 1',
    [source, name]
  );
  return rows[0] || null;
}

async function deleteBookTransaction(source, book_id) {
  const tableMap = {
    zongheng: 'zongheng_book_data',
    qimao: 'qimao_book_data',
    shuqi: 'shuqi_book_data'
  };
  const dataTable = tableMap[source];

  await db.query('START TRANSACTION');
  try {
    await db.query(`DELETE FROM ${dataTable} WHERE book_id = ?`, [book_id]);
    await db.query('DELETE FROM book_source WHERE book_id = ? AND source = ?', [book_id, source]);
    await db.query('COMMIT');
  } catch (e) {
    await db.query('ROLLBACK');
    throw e;
  }
}

module.exports = {
  insertBookSource,
  insertZonghengBookData,
  insertQimaoBookData,
  insertShuqiBookData,
  findBookBySourceAndUrl,
  findBookBySourceAndName,
  deleteBookTransaction
};
