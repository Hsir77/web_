const pool = require("../config/db");

const TABLES = [
  "book_source",
  "zongheng_book_data",
  "shuqi_book_data",
  "qimao_book_data",
  "user_bookshelf",
];

const getTableSchema = async () => {
  const [rows] = await pool.query(
    `
    SELECT 
      TABLE_NAME,
      COLUMN_NAME,
      DATA_TYPE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME IN (?)
    ORDER BY TABLE_NAME, ORDINAL_POSITION
  `,
    [TABLES]
  );

  const grouped = {};

  for (const row of rows) {
    if (!grouped[row.TABLE_NAME]) {
      grouped[row.TABLE_NAME] = [];
    }

    grouped[row.TABLE_NAME].push({
      name: row.COLUMN_NAME,
      type: row.DATA_TYPE,
    });
  }

  return grouped;
};

const getExampleData = async () => {
  const result = {};

  for (const table of TABLES) {
    const [rows] = await pool.query(`SELECT * FROM ${table} LIMIT 3`);

    // 深拷贝，避免修改原始数据
    const processedRows = rows.map(row => {
      const newRow = { ...row };

      if (table === "qimao_book_data" || table === "zongheng_book_data") {
        if ("chapter1_content" in newRow) newRow.chapter1_content = "第一章内容";
        if ("chapter2_content" in newRow) newRow.chapter2_content = "第二章内容";
        if ("chapter3_content" in newRow) newRow.chapter3_content = "第三章内容";
        if ("chapter_catalog" in newRow) newRow.chapter_catalog = "章节目录";
      }

      if (table === "shuqi_book_data") {
        if ("chapter_catalog" in newRow) newRow.chapter_catalog = "章节目录";
      }

      return newRow;
    });

    result[table] = processedRows;
  }

  return result;
};

async function executeSql(sql) {
  try {
    const [rows] = await pool.query(sql);

    const dataStr = JSON.stringify(rows, null, 2);

    return {
      success: true,
      sql: sql,
      data: dataStr 
    };
  } catch (err) {
    return {
      success: false,
      sql: sql,
      error: err.message
    };
  }
}

module.exports = {
  getTableSchema,
  getExampleData,
  executeSql
};