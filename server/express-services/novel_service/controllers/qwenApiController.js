const OpenAI = require("openai");
const { getLatestPrompt } = require("../models/promptModel.js");
const {
  getTableSchema,
  getExampleData,
  executeSql,
} = require("../models/qwenModel.js");

const openaiClient = new OpenAI({
  apiKey: "sk-8589b7a3608d4eb6b2f6f71f72890683",
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

// 控制器内部函数1：AI生成SQL
async function generateSql(params) {
  const { userQuestion, model, temperature, sqlDialect } = params;

  if (!userQuestion) {
    throw new Error("缺少用户问题");
  }

  const promptConfig = await getLatestPrompt();

  const schema = await getTableSchema();
  const examples = await getExampleData();

  const schemaBlock = formatSchema(schema);
  const exampleBlock = formatExamples(examples);

  const systemPrompt = promptConfig.sql_prompt
    .replace("{tableSchema}", schemaBlock)
    .replace("{examples}", exampleBlock);
  console.log('systemPrompt',systemPrompt)
  const completion = await openaiClient.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuestion },
    ],
    temperature: 0.2,
    max_tokens: 500,
  });

  const content = completion.choices[0].message.content.trim();

  const data = JSON.parse(content.trim());
  const sql = data.sql;

  if (!sql) {
    throw new Error("未解析到SQL");
  }

  return {
    sql: data.sql,
    taskinsctruction: data.taskinsctruction,
  };
}

// --------------------------
// 控制器内部函数2：AI分析数据库结果（生成最终回答）
// --------------------------
async function analyzeDbDataByAi(params) {
  const {
    userQuestion,
    dbData,
    taskinsctruction,
    model,
    temperature = 0.7,
  } = params;

  if (!userQuestion) {
    throw new Error("缺少用户问题");
  }
  if (!dbData) {
    throw new Error("缺少数据库查询结果");
  }
  if (!taskinsctruction) {
    throw new Error("缺少上一轮AI的任务指令");
  }

  const promptConfig = await getLatestPrompt();

  const systemPrompt = promptConfig.text_prompt
    .replace("{dbData}", dbData)
    .replace("{taskinsctructionAI1}", taskinsctruction);

  const completion = await openaiClient.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userQuestion },
    ],
    temperature,
    max_tokens: 1000,
  });

  const finalAnswer = completion.choices[0].message.content.trim();

  if (!finalAnswer) {
    throw new Error("AI分析结果为空");
  }

  return finalAnswer;
}

// --------------------------
// 控制器主函数（仅参数校验+流程调度+响应返回）
// --------------------------
// 2. 改用CommonJS的exports暴露函数（替换ESM的export）
async function getQwenChatAnswer(req, res) {
  try {
    // 1. 权限校验（保留你的原有逻辑）
    if (!req.user?.permissions?.includes("analysis:view")) {
      return res.status(403).json({
        code: 403,
        msg: "当前用户没有分析权限",
        data: null,
      });
    }

    // 2. 提取并格式化请求参数
    const {
      messages, // 用户消息数组（必填）
      model = "qwen-plus",
      temperature = 0.7,
      sqlDialect = "mysql",
    } = req.body;

    // 3. 严格参数校验（控制器核心职责）
    // 校验messages
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        code: 400,
        msg: "参数错误：messages必须是数组且不能为空",
        data: null,
      });
    }
    const isValidMessage = messages.every(
      (item) => item.role && item.content && typeof item.content === "string",
    );
    if (!isValidMessage) {
      return res.status(400).json({
        code: 400,
        msg: "参数错误：messages每个元素必须包含role和非空content",
        data: null,
      });
    }

    // 提取用户核心问题（取最后一条user消息）
    const userQuestion = messages
      .filter((item) => item.role === "user")
      .pop()?.content;
    if (!userQuestion) {
      return res.status(400).json({
        code: 400,
        msg: "参数错误：messages中未找到用户问题",
        data: null,
      });
    }

    // 4. 核心流程调度（串联AI生成SQL → 数据层执行SQL → AI分析结果）
    // 步骤1：AI生成SQL
    const { sql, taskinsctruction } = await generateSql({
      userQuestion,
      model,
      temperature,
      sqlDialect,
    });
    console.log("sqlsql", sql);

    // 步骤2：调用数据层执行SQL
    const dbResult = await executeSql(sql);
    if (!dbResult.success) {
      return res.status(500).json({
        code: 500,
        msg: dbResult.error,
        data: { sql: dbResult.sql },
      });
    }
    // 步骤3：AI分析数据库结果
    const finalAnswer = await analyzeDbDataByAi({
      userQuestion,
      dbData: dbResult.data,
      taskinsctruction: taskinsctruction,
      model,
    });

    // 5. 返回最终响应
    res.status(200).json({
      code: 200,
      msg: "分析完成",
      data: {
        userQuestion: userQuestion, // 用户原始问题
        sql: dbResult.sql, // 生成并执行的SQL
        dbData:dbResult,
        finalAnswer: finalAnswer, // AI最终分析回答
      },
    });
  } catch (error) {
    // 统一错误处理
    console.error("分析流程异常：", error.message);
    res.status(500).json({
      code: 500,
      msg: `分析失败：${error.message || "未知错误"}`,
      data: null,
    });
  }
}

const formatSchema = (schemaObj) => {
  let str = "";

  for (const table in schemaObj) {
    str += `Table: ${table}\nColumns:\n`;

    schemaObj[table].forEach((col) => {
      str += `- ${col.name} (${col.type})\n`;
    });

    str += "\n";
  }

  return `\`\`\`sql\n${str.trim()}\n\`\`\``;
};

const formatExamples = (exampleData) => {
  let str = "";

  for (const table in exampleData) {
    const rows = exampleData[table];

    if (!rows || rows.length === 0) continue;

    const columns = Object.keys(rows[0]);

    // 添加表头
    str += `-- 示例：查询 ${table} 数据\n`;
    str += columns.join(" | ") + "\n";

    // 添加每一行数据
    rows.forEach((row) => {
      const values = columns.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return "NULL";
        if (typeof val === "string") return val.replace(/\n/g, "\\n"); // 换行转义
        return val.toString();
      });
      str += values.join(" | ") + "\n";
    });

    str += "\n"; // 表与表之间空一行
  }

  return `\`\`\`sql\n${str.trim()}\n\`\`\``;
};
// 3. 暴露主函数（CommonJS规范）
module.exports = {
  getQwenChatAnswer,
};
