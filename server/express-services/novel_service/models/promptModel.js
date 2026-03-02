// models/promptModel.js
const pool = require("../config/db");

// 1. 根据最新update_time查询数据
const getLatestPrompt = async () => {
  const [rows] = await pool.query(`
    SELECT sql_prompt, text_prompt 
    FROM ai_prompt_config 
    ORDER BY update_time DESC 
    LIMIT 1
  `);
  return rows[0] || null;
};

// 2. 新增数据（覆盖式更新，按最新update_time）
const addOrUpdatePrompt = async (sql_prompt, text_prompt) => {
  const [result] = await pool.query(`
    INSERT INTO ai_prompt_config (sql_prompt, text_prompt)
    VALUES (?, ?)
  `, [sql_prompt, text_prompt]);
  return result;
};

module.exports = {
  getLatestPrompt,
  addOrUpdatePrompt
};