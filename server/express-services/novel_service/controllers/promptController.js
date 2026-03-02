// controllers/promptController.js
const promptModel = require("../models/promptModel");

// 1. 查询最新Prompt配置
async function getLatestPromptConfig(req, res) {
  try {
    if (!req.user.permissions.includes("prompt:search")) {
      return res.status(403).json({
        code: 403,
        message: "当前用户没有权限查看Prompt配置"
      });
    }

    const data = await promptModel.getLatestPrompt();

    res.json({
      code: 200,
      message: "success",
      data: {
        sql_prompt: data?.sql_prompt || "",
        text_prompt: data?.text_prompt || ""
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}

async function updatePromptConfig(req, res) {
  try {
    // 权限判断
    if (!req.user.permissions.includes("prompt:edit")) {
      return res.status(403).json({
        code: 403,
        message: "当前用户没有权限修改Prompt配置"
      });
    }

    const { sql_prompt, text_prompt } = req.body;
    if (!sql_prompt || !text_prompt) {
      return res.status(400).json({
        code: 400,
        message: "参数错误：sql_prompt 和 text_prompt 不能为空"
      });
    }

    const result = await promptModel.addOrUpdatePrompt(sql_prompt, text_prompt);

    res.json({
      code: 200,
      message: "success",
      data: {
        affectedRows: result.affectedRows,
        insertId: result.insertId
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}

module.exports = {
  getLatestPromptConfig,
  updatePromptConfig
};