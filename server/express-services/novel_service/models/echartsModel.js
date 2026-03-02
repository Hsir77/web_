const pool = require("../config/db");

// 分类分析
exports.getCategoryStatsZongheng = async () => {
  const [rows] = await pool.query(`
    SELECT 
      category,
      COUNT(*) AS count
    FROM zongheng_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
  `);

  return rows;
};

exports.getCategoryStatsQimao = async () => {
  const [rows] = await pool.query(`
    SELECT 
      category,
      COUNT(*) AS count
    FROM qimao_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
  `);

  return rows;
};

exports.getCategoryStatsShuqi = async () => {
  const [rows] = await pool.query(`
    SELECT 
      category,
      COUNT(*) AS count
    FROM shuqi_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
  `);

  return rows;
};

// 内容分析
// 字数维度
// 字数分布
exports.getEchartsContentWordcount = async () => {
  const [rows] = await pool.query(`
    SELECT
      CASE
        WHEN word_count < 500000 THEN '0-50万'
        WHEN word_count < 1000000 THEN '50-100万'
        WHEN word_count < 2000000 THEN '100-200万'
        ELSE '200万+'
      END AS word_range,
      COUNT(*) AS count
    FROM (
      SELECT word_count FROM zongheng_book_data
      UNION ALL
      SELECT word_count FROM qimao_book_data
      UNION ALL
      SELECT word_count FROM shuqi_book_data
    ) t
    WHERE word_count IS NOT NULL
    GROUP BY word_range
  `);

  return rows;
};
// 字数 × 连载状态
exports.getEchartsContentWordcountStatus = async () => {
  const [rows] = await pool.query(`
    SELECT
  book_status,
  word_range,
  COUNT(*) AS count
FROM (
  SELECT 
    CASE 
      WHEN book_status IN ('连载中', '连载') THEN '连载中'
      WHEN book_status IN ('已完结', '完结') THEN '完结'
      ELSE '未知'
    END COLLATE utf8mb4_unicode_ci AS book_status,
    CASE
      WHEN word_count < 500000 THEN '0-50万'
      WHEN word_count < 1000000 THEN '50-100万'
      WHEN word_count < 2000000 THEN '100-200万'
      ELSE '200万+'
    END AS word_range
  FROM zongheng_book_data

  UNION ALL

  SELECT 
    CASE 
      WHEN book_status IN ('连载中') THEN '连载中'
      WHEN book_status IN ('完结') THEN '完结'
      ELSE '未知'
    END COLLATE utf8mb4_unicode_ci,
    CASE
      WHEN word_count < 500000 THEN '0-50万'
      WHEN word_count < 1000000 THEN '50-100万'
      WHEN word_count < 2000000 THEN '100-200万'
      ELSE '200万+'
    END
  FROM qimao_book_data

  UNION ALL

  SELECT 
    CASE 
      WHEN book_status IN ('连载') THEN '连载中'
      WHEN book_status IN ('完结') THEN '完结'
      ELSE '未知'
    END COLLATE utf8mb4_unicode_ci,
    CASE
      WHEN word_count < 500000 THEN '0-50万'
      WHEN word_count < 1000000 THEN '50-100万'
      WHEN word_count < 2000000 THEN '100-200万'
      ELSE '200万+'
    END
  FROM shuqi_book_data
) t
WHERE book_status != '未知'
GROUP BY book_status, word_range
ORDER BY word_range;
  `);

  return rows;
};

// 状态维度
exports.getEchartsContentStatus = async () => {
  const sql = `
    SELECT 
      status,
      COUNT(*) AS value
    FROM (
      SELECT 
        CASE 
          WHEN book_status IN ('已完结', '完结') THEN '完结'
          WHEN book_status IN ('连载中', '连载') THEN '连载中'
          ELSE '未知'
        END AS status
      FROM zongheng_book_data

      UNION ALL

      SELECT 
        CASE 
          WHEN book_status IN ('已完结', '完结') THEN '完结'
          WHEN book_status IN ('连载中', '连载') THEN '连载中'
          ELSE '未知'
        END AS status
      FROM qimao_book_data

      UNION ALL

      SELECT 
        CASE 
          WHEN book_status IN ('已完结', '完结') THEN '完结'
          WHEN book_status IN ('连载中', '连载') THEN '连载中'
          ELSE '未知'
        END AS status
      FROM shuqi_book_data
    ) t
    GROUP BY status
  `;

  const [rows] = await pool.query(sql);

  return rows;
};

// 性别维度
// 性别分布（饼图）
exports.getEchartsContentGender = async () => {
  const sql = `
    SELECT
      CASE 
        WHEN gender = 'male' THEN '男频'
        WHEN gender = 'female' THEN '女频'
      END AS gender,
      COUNT(*) AS value
    FROM book_source
    WHERE gender IN ('male', 'female')
    GROUP BY gender
  `;

  const [rows] = await pool.query(sql);
  return rows;
};
// 性别 + 字数分布
exports.getEchartsContentGenderWordCount = async () => {
  const sql = `
    SELECT
      gender,
      word_range,
      COUNT(*) AS count
    FROM (
      SELECT 
        CASE 
          WHEN bs.gender = 'male' THEN '男频'
          WHEN bs.gender = 'female' THEN '女频'
        END AS gender,

        CASE
          WHEN t.word_count < 500000 THEN '0-50万'
          WHEN t.word_count < 1000000 THEN '50-100万'
          WHEN t.word_count < 2000000 THEN '100-200万'
          ELSE '200万+'
        END AS word_range

      FROM (
        SELECT CAST(book_id AS CHAR) AS book_id, word_count FROM zongheng_book_data
        UNION ALL
        SELECT CAST(book_id AS CHAR) AS book_id, word_count FROM qimao_book_data
        UNION ALL
        SELECT CAST(book_id AS CHAR) AS book_id, word_count FROM shuqi_book_data
      ) t

      LEFT JOIN book_source bs 
        ON t.book_id = CAST(bs.book_id AS CHAR)

      WHERE 
        bs.gender IN ('male', 'female')
        AND t.word_count IS NOT NULL
    ) t2
    GROUP BY gender, word_range
    ORDER BY word_range, gender
  `;

  const [rows] = await pool.query(sql);
  return rows;
};

// 章节维度
// 平均每章字数分布
// 字数 × 章节数（散点图）
exports.getEchartsContentChaptorWordCount = async () => {
  const sql = `
    SELECT 
      word_count,
      chapter_count
    FROM zongheng_book_data
    WHERE word_count IS NOT NULL AND chapter_count IS NOT NULL

    UNION ALL

    SELECT 
      word_count,
      chapter_count
    FROM qimao_book_data
    WHERE word_count IS NOT NULL AND chapter_count IS NOT NULL

    UNION ALL

    SELECT 
      word_count,
      chapter_count
    FROM shuqi_book_data
    WHERE word_count IS NOT NULL AND chapter_count IS NOT NULL
  `;

  const [rows] = await pool.query(sql);
  return rows;
};
exports.getEchartsContentAverage = async () => {
  const sql = `
    SELECT
      avg_range,
      COUNT(*) AS count
    FROM (
      SELECT
        CASE
          WHEN avg_words < 2000 THEN '0-2k'
          WHEN avg_words < 4000 THEN '2k-4k'
          WHEN avg_words < 6000 THEN '4k-6k'
          ELSE '6k+'
        END AS avg_range
      FROM (
        SELECT word_count / chapter_count AS avg_words
        FROM zongheng_book_data
        WHERE word_count IS NOT NULL AND chapter_count > 0

        UNION ALL

        SELECT word_count / chapter_count
        FROM qimao_book_data
        WHERE word_count IS NOT NULL AND chapter_count > 0

        UNION ALL

        SELECT word_count / chapter_count
        FROM shuqi_book_data
        WHERE word_count IS NOT NULL AND chapter_count > 0
      ) t1
    ) t2
    GROUP BY avg_range
  `;

  const [rows] = await pool.query(sql);
  return rows;
};

// 热度维度
// 1 分类 × 周订阅（柱状图）
exports.getEchartsPopularityZonghengCategoryWeeklySubscribe = async () => {
  const sql = `
    SELECT 
      category,
      SUM(weekly_recommend) AS weekly_recommend
    FROM zongheng_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY weekly_recommend DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 2️分类 × 总订阅（柱状图）
exports.getEchartsPopularityZonghengCategoryTotalSubscribe = async () => {
  const sql = `
    SELECT 
      category,
      SUM(total_recommend) AS total_recommend
    FROM zongheng_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY total_recommend DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 3️点击数 × 总订阅（散点图）
exports.getEchartsPopularityZonghengClickSubscribe = async () => {
  const sql = `
    SELECT 
      total_click,
      total_recommend
    FROM zongheng_book_data
    WHERE total_click IS NOT NULL AND total_recommend IS NOT NULL
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 总订阅 Top10（横向柱状图）
exports.getEchartsRankingZonghengTop10ClickSubscribe = async () => {
  const sql = `
    SELECT 
      book_name,
      total_recommend
    FROM zongheng_book_data
    WHERE total_recommend IS NOT NULL
    ORDER BY total_recommend DESC
    LIMIT 10
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 5️分类 × 阅读数（柱状图）
exports.getEchartsPopularityQimaoCategoryReadCount = async () => {
  const sql = `
    SELECT 
      category,
      SUM(read_count) AS read_count
    FROM qimao_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY read_count DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 6️分类 × 评分（柱状图）
exports.getEchartsPopularityQimaoCategoryScore = async () => {
  const sql = `
    SELECT 
      category,
      AVG(score) AS avg_score
    FROM qimao_book_data
    WHERE category IS NOT NULL AND score IS NOT NULL
    GROUP BY category
    ORDER BY avg_score DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 7️阅读数 × 评分（散点图）
exports.getEchartsPopularityQimaoReadCountScore = async () => {
  const sql = `
    SELECT 
      read_count,
      score
    FROM qimao_book_data
    WHERE read_count IS NOT NULL AND score IS NOT NULL
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 8️人气值 Top10（横向柱状图）
exports.getEchartsRankingQimaoTop10ReadcountScore = async () => {
  const sql = `
    SELECT 
      book_name,
      popularity
    FROM qimao_book_data
    WHERE popularity IS NOT NULL
    ORDER BY popularity DESC
    LIMIT 10
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 9️分类 × 人气值（柱状图）
exports.getEchartsPopularityShuqiCategoryPopularityValue = async () => {
  const sql = `
    SELECT 
      category,
      SUM(popularity) AS popularity
    FROM shuqi_book_data
    WHERE category IS NOT NULL
    GROUP BY category
    ORDER BY popularity DESC
  `;
  const [rows] = await pool.query(sql);
  return rows;
};
// 10️人气值 Top10（横向柱状图）
exports.getEchartsRankingShuqiTop10CategoryPopularity = async () => {
  const sql = `
    SELECT 
      book_name,
      popularity
    FROM shuqi_book_data
    WHERE popularity IS NOT NULL
    ORDER BY popularity DESC
    LIMIT 10
  `;
  const [rows] = await pool.query(sql);
  return rows;
};