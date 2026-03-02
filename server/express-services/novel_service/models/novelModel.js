const pool = require("../config/db");

exports.getBookSourceList = async () => {
  const [rows] = await pool.execute("SELECT * FROM book_source");
  return rows;
};

exports.getZonghengBookList = async (page = 1, size = 20, filter = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.max(1, Math.min(100, parseInt(size, 10) || 20));
  const offset = (pageNum - 1) * sizeNum;

  const whereConditions = [];
  const queryParams = [];

  if (filter.book_status) {
    whereConditions.push("book_status = ?");
    queryParams.push(filter.book_status);
  }

  if (filter.category) {
    whereConditions.push("category = ?");
    queryParams.push(filter.category);
  }

  if (filter.gender) {
    joinSql = `
      LEFT JOIN novel_data.book_source bs 
      ON z.book_id = bs.book_id
    `;
    whereConditions.push("bs.gender = ?");
    queryParams.push(filter.gender);
  }

  if (filter.word_count) {
    whereConditions.push("word_count >= ?");
    queryParams.push(filter.word_count);
  }
  if (filter.chapter_count) {
    whereConditions.push("chapter_count >= ?");
    queryParams.push(filter.chapter_count);
  }
  if (filter.total_click) {
    whereConditions.push("total_click >= ?");
    queryParams.push(filter.total_click);
  }
  if (filter.total_recommend) {
    whereConditions.push("total_recommend >= ?");
    queryParams.push(filter.total_recommend);
  }
  if (filter.weekly_recommend) {
    whereConditions.push("weekly_recommend >= ?");
    queryParams.push(filter.weekly_recommend);
  }

  const whereSql =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";
  const sql = `
    SELECT 
      z.book_id, z.book_name, z.author_name, z.book_status, z.category, z.word_count, 
      z.book_intro, z.cover_url, z.total_recommend
    FROM novel_data.zongheng_book_data z
    ${joinSql}
    ${whereSql}
    ORDER BY z.book_id DESC 
    LIMIT ${sizeNum} OFFSET ${offset}
  `;

  try {
    console.log("最终执行SQL：", sql);
    console.log("筛选参数数组：", queryParams);
    const [list] = await pool.execute(sql, queryParams);
    const listWithSource = list.map((item) => ({
      ...item,
      source: "zongheng",
    }));

    const countSql = `
      SELECT COUNT(*) as total 
      FROM novel_data.zongheng_book_data z
      ${joinSql}
      ${whereSql}
    `;
    const [countRes] = await pool.execute(countSql, queryParams);

    return {
      list: listWithSource,
      total: countRes[0].total,
      page: pageNum,
      size: sizeNum,
    };
  } catch (error) {
    console.error("纵横接口错误：", error.message);
    console.error("执行的SQL：", sql);
    throw error;
  }
};

exports.getQimaoBookList = async (page = 1, size = 20, filter = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.max(1, Math.min(100, parseInt(size, 10) || 20));
  const offset = (pageNum - 1) * sizeNum;

  const whereConditions = [];
  const queryParams = [];
  let joinSql = "";

  if (filter.book_status) {
    whereConditions.push("book_status = ?");
    queryParams.push(filter.book_status);
  }

  if (filter.category) {
    whereConditions.push("category = ?");
    queryParams.push(filter.category);
  }

  if (filter.gender) {
    joinSql = `
      LEFT JOIN novel_data.book_source bs 
      ON q.book_id COLLATE utf8mb4_0900_ai_ci = bs.book_id
    `;
    whereConditions.push("bs.gender COLLATE utf8mb4_0900_ai_ci = ?");
    queryParams.push(filter.gender);
  }

  if (filter.word_count) {
    whereConditions.push("word_count >= ?");
    queryParams.push(filter.word_count);
  }

  if (filter.chapter_count) {
    whereConditions.push("chapter_count >= ?");
    queryParams.push(filter.chapter_count);
  }

  if (filter.score) {
    whereConditions.push("score >= ?");
    queryParams.push(filter.score);
  }

  if (filter.popularity) {
    whereConditions.push("popularity >= ?");
    queryParams.push(filter.popularity);
  }

  if (filter.read_count) {
    whereConditions.push("read_count >= ?");
    queryParams.push(filter.read_count);
  }

  const whereSql =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const sql = `
    SELECT 
      q.book_id, q.book_name, q.author_name, q.book_status, q.category, q.word_count, 
      q.chapter_count, q.score, q.popularity, q.read_count, q.book_intro, q.cover_url
    FROM novel_data.qimao_book_data q
    ${joinSql}
    ${whereSql}
    ORDER BY q.book_id DESC 
    LIMIT ${sizeNum} OFFSET ${offset}
  `;

  try {
    // 打印调试信息（生产环境可注释）
    console.log("七猫最终执行SQL：", sql);
    console.log("七猫筛选参数数组：", queryParams);

    // 执行列表查询
    const [list] = await pool.execute(sql, queryParams);
    const listWithSource = list.map((item) => ({
      ...item,
      source: "qimao",
    }));
    // 6. 构建总数查询SQL
    const countSql = `
      SELECT COUNT(*) as total 
      FROM novel_data.qimao_book_data q
      ${joinSql}
      ${whereSql}
    `;
    const [countRes] = await pool.execute(countSql, queryParams);

    // 7. 返回分页结果
    return {
      list: listWithSource,
      total: countRes[0].total,
      page: pageNum,
      size: sizeNum,
    };
  } catch (error) {
    // 错误日志（包含SQL便于排查）
    console.error("七猫接口错误：", error.message);
    console.error("执行的SQL：", sql);
    throw error; // 抛出错误让上层接口处理
  }
};

exports.getShuqiBookList = async (page = 1, size = 20, filter = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const sizeNum = Math.max(1, Math.min(100, parseInt(size, 10) || 20));
  const offset = (pageNum - 1) * sizeNum;

  const whereConditions = [];
  const queryParams = [];
  let joinSql = "";

  // 状态
  if (filter.book_status) {
    whereConditions.push("s.book_status = ?");
    queryParams.push(filter.book_status);
  }

  // 分类
  if (filter.category) {
    whereConditions.push("s.category = ?");
    queryParams.push(filter.category);
  }

  // 性别（需要连表）
  if (filter.gender) {
    joinSql = `
      LEFT JOIN novel_data.book_source bs
      ON s.book_id COLLATE utf8mb4_0900_ai_ci = bs.book_id
    `;
    whereConditions.push("bs.gender COLLATE utf8mb4_0900_ai_ci = ?");
    queryParams.push(filter.gender);
  }

  // 字数
  if (filter.word_count !== undefined) {
    whereConditions.push("s.word_count >= ?");
    queryParams.push(filter.word_count);
  }

  // 章节数
  if (filter.chapter_count !== undefined) {
    whereConditions.push("s.chapter_count >= ?");
    queryParams.push(filter.chapter_count);
  }

  // 热度（注意字段名）
  if (filter.popularily !== undefined) {
    whereConditions.push("s.popularity >= ?");
    queryParams.push(filter.popularily);
  }

  const whereSql =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  const sql = `
    SELECT 
      s.book_id,
      s.book_name,
      s.author_name,
      s.book_status,
      s.category,
      s.word_count,
      s.chapter_count,
      s.popularity,
      s.book_intro,
      s.cover_url
    FROM novel_data.shuqi_book_data s
    ${joinSql}
    ${whereSql}
    ORDER BY s.book_id DESC
    LIMIT ${sizeNum} OFFSET ${offset}
  `;

  try {
    console.log("书旗最终SQL：", sql);
    console.log("参数：", queryParams);

    const [list] = await pool.execute(sql, queryParams);
    const listWithSource = list.map((item) => ({
      ...item,
      source: "shuqi",
    }));
    const countSql = `
      SELECT COUNT(*) as total
      FROM novel_data.shuqi_book_data s
      ${joinSql}
      ${whereSql}
    `;

    const [countRes] = await pool.execute(countSql, queryParams);

    return {
      list: listWithSource,
      total: countRes[0].total,
      page: pageNum,
      size: sizeNum,
    };
  } catch (error) {
    console.error("书旗接口错误：", error.message);
    console.error("SQL：", sql);
    throw error;
  }
};

exports.getNovelDetail = async (user_id, book_id, source) => {
  const userId = parseInt(user_id, 10);
  const bookId = parseInt(book_id, 10);

  if (isNaN(userId) || userId <= 0) {
    throw new Error("参数非法：user_id 必须为大于 0 的数字");
  }

  if (isNaN(bookId) || bookId <= 0) {
    throw new Error("参数非法：book_id 必须为大于 0 的数字");
  }

  const allowedSources = ["shuqi", "qimao" , "zongheng"];

  if (!allowedSources.includes(source)) {
    throw new Error("非法 source");
  }

  const bookTable = `novel_data.${source}_book_data`;

  const sql = `
    SELECT
      b.*,
      s.url,
      s.gender,
      IF(ub.id IS NOT NULL, TRUE, FALSE) AS is_collect
    FROM ${bookTable} b
    LEFT JOIN novel_data.book_source s 
      ON b.book_id COLLATE utf8mb4_unicode_ci = s.book_id COLLATE utf8mb4_unicode_ci
      AND s.source = ?
    LEFT JOIN novel_data.user_bookshelf ub 
      ON b.book_id COLLATE utf8mb4_unicode_ci = ub.novel_id COLLATE utf8mb4_unicode_ci 
      AND ub.user_id = ?
      AND ub.source = ?
    WHERE b.book_id = ?
  `;

  const params = [
    source,  // s.source
    userId,  // ub.user_id
    source,  // ub.source
    bookId   // b.book_id
  ];

  try {
    console.log("执行SQL：", sql);
    console.log("参数：", params);

    const [rows] = await pool.execute(sql, params);

    if (rows.length === 0) {
      return null;
    }
    const detail = rows[0];
    detail.source = source; 

    return detail;
  } catch (error) {
    console.error("查询小说详情错误：", error.message);
    console.error("SQL：", sql);
    console.error("参数：", params);
    throw error;
  }
};

// 搜索接口
exports.searchBooks = async (keyword) => {
  const NOVEL_CONFIG = {
    sourcePriority: { zongheng: 1, qimao: 2, shuqi: 3 }, 
    sourceTableMap: {
      zongheng: 'novel_data.zongheng_book_data',
      qimao: 'novel_data.qimao_book_data',
      shuqi: 'novel_data.shuqi_book_data'
    },
    returnFields: ['book_id', 'book_name', 'author_name', 'cover_url', 'book_status', 'source']
  };

  const normalizeStr = (str) => {
    if (str === null || str === undefined || typeof str !== 'string') {
      return 'unknown'; 
    }
    return str.trim().replace(/\s+/g, ''); 
  };

  const normalizedKeyword = normalizeStr(keyword);
  if (normalizedKeyword === 'unknown') {
    throw new Error('搜索关键词不能为空');
  }
  const like = `%${normalizedKeyword}%`; 

  const allRawData = [];
  for (const [source, table] of Object.entries(NOVEL_CONFIG.sourceTableMap)) {
    try {
      const [singleData] = await pool.execute(`
        SELECT
          book_id,
          book_name,
          author_name,
          cover_url,
          book_status,
          ? AS source
        FROM ${table}
        WHERE book_name LIKE ? OR author_name LIKE ?
      `, [source, like, like]);

      if (Array.isArray(singleData) && singleData.length > 0) {
        allRawData.push(...singleData);
      }
    } catch (error) {
      console.error(`查询${source}数据源失败：`, error); 
      continue;
    }
  }

  const uniqueMap = new Map();
  allRawData.sort((a, b) => {
    return NOVEL_CONFIG.sourcePriority[a.source] - NOVEL_CONFIG.sourcePriority[b.source];
  }).forEach(item => {
    const authorKey = normalizeStr(item.author_name);
    const bookKey = normalizeStr(item.book_name);
    const uniqueKey = `${authorKey}_${bookKey}`;

    if (!uniqueMap.has(uniqueKey)) {
      uniqueMap.set(uniqueKey, item);
    }
  });

  const finalResult = Array.from(uniqueMap.values()).map(item => {
    const formattedItem = {};
    NOVEL_CONFIG.returnFields.forEach(field => {
      formattedItem[field] = item[field] ?? null;
    });
    return formattedItem;
  });

  return finalResult;
};

// 我的书库查询接口
exports.searchMyBookshelf = async (userId, keyword) => {
  const like = `%${keyword}%`;

  const [zongheng] = await pool.execute(`
    SELECT
      b.book_id,
      b.book_name,
      b.author_name,
      b.cover_url,
      b.book_status,
      'zongheng' AS source
    FROM novel_data.zongheng_book_data b
    JOIN user_bookshelf s
      ON b.book_id = s.novel_id
     AND s.source = 'zongheng'
     AND s.user_id = ?
    WHERE b.book_name LIKE ? OR b.author_name LIKE ?
  `, [userId, like, like]);

  const [qimao] = await pool.execute(`
    SELECT
      b.book_id,
      b.book_name,
      b.author_name,
      b.cover_url,
      b.book_status,
      'qimao' AS source
    FROM novel_data.qimao_book_data b
    JOIN user_bookshelf s
      ON b.book_id = s.novel_id
     AND s.source = 'qimao'
     AND s.user_id = ?
    WHERE b.book_name LIKE ? OR b.author_name LIKE ?
  `, [userId, like, like]);

  const [shuqi] = await pool.execute(`
    SELECT
      b.book_id,
      b.book_name,
      b.author_name,
      b.cover_url,
      b.book_status,
      'shuqi' AS source
    FROM novel_data.shuqi_book_data b
    JOIN user_bookshelf s
      ON b.book_id = s.novel_id
     AND s.source = 'shuqi'
     AND s.user_id = ?
    WHERE b.book_name LIKE ? OR b.author_name LIKE ?
  `, [userId, like, like]);

  const allBooks = [...zongheng, ...qimao, ...shuqi];

  function normalizeStr(str) {
    if (str == null || typeof str !== 'string') return 'unknown';
    return str.trim().replace(/\s+/g, '');
  }

  const sourcePriority = { zongheng: 1, qimao: 2, shuqi: 3 };
  const bookMap = new Map();

  allBooks
    .sort((a, b) => sourcePriority[a.source] - sourcePriority[b.source])
    .forEach(book => {
      const key = `${normalizeStr(book.author_name)}_${normalizeStr(book.book_name)}`;
      if (!bookMap.has(key)) {
        bookMap.set(key, book);
      }
    });

  return Array.from(bookMap.values());
};