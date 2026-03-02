const pool = require("../config/db");

// 1. 加入书架
async function addBookshelf(user_id, novel_id, source) {
  const [result] = await pool.query(
    `INSERT INTO user_bookshelf (user_id, novel_id, source, last_view_time)
     VALUES (?, ?, ?, NOW())`,
    [user_id, novel_id, source],
  );
  return result;
}

// 2. 取消书架（删除）
async function deleteBookshelf(user_id, novel_id) {
  const [result] = await pool.query(
    `DELETE FROM user_bookshelf
     WHERE user_id = ? AND novel_id = ?`,
    [user_id, novel_id],
  );
  return result;
}

// 3.获取书架的书
async function getBookshelfList(user_id) {
  const [bookshelfRows] = await pool.query(
    `SELECT novel_id, source, last_view_time 
     FROM user_bookshelf
     WHERE user_id = ?
     ORDER BY last_view_time DESC`,
    [user_id],
  );

  if (bookshelfRows.length === 0) {
    return [];
  }

  const resultList = [];
  for (const item of bookshelfRows) {
    const { novel_id, source, last_view_time } = item;
    const bookTable = `${source}_book_data`;

    const [bookRows] = await pool.query(
      `SELECT 
        z.book_id, 
        z.book_name, 
        z.author_name, 
        z.book_status, 
        z.category, 
        z.word_count, 
        z.book_intro, 
        z.cover_url,
        ? AS source,  -- 显式返回source字段
        ? AS last_view_time  -- 带上书架的最后访问时间
      FROM ${bookTable} z
      WHERE z.book_id = ?`,
      [source, last_view_time, novel_id],
    );

    // 如果查到书籍数据，整合到结果里
    if (bookRows.length > 0) {
      resultList.push(bookRows[0]);
    }
  }

  return resultList;
}

async function getTrialChapters(book_id, source) {
  const TABLE_MAP = {
    qimao: "qimao_book_data",
    zongheng: "zongheng_book_data",
  };
  const tableName = TABLE_MAP[source];

  if (!tableName) {
    return [];
  }

  const [rows] = await pool.query(
    `SELECT 
      chapter1_content,
      chapter2_content,
      chapter3_content
     FROM ${tableName}
     WHERE book_id = ?`,
    [book_id]
  );

  if (!rows || rows.length === 0) {
    return [];
  }

  const row = rows[0];
  const resultList = [];

  // 只返回非空章节
  if (row.chapter1_content) {
    resultList.push({ chapter_id: 1, title: "第一章", content: row.chapter1_content });
  }
  if (row.chapter2_content) {
    resultList.push({ chapter_id: 2, title: "第二章", content: row.chapter2_content });
  }
  if (row.chapter3_content) {
    resultList.push({ chapter_id: 3, title: "第三章", content: row.chapter3_content });
  }

  return resultList;
}


module.exports = {
  addBookshelf,
  deleteBookshelf,
  getBookshelfList,
  getTrialChapters
};
