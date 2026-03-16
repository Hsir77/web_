const novelModel = require("../models/novelModel");

const { updateLastViewTime } = require("../utils/bookShelfLRU")

exports.getBookSourceList = async (req, res) => {
  try {
    const bookSourceList = await novelModel.getBookSourceList();
    res.json({
      code: 200,
      message: "获取book_source列表成功",
      data: bookSourceList,
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: "获取book_source列表失败：" + error.message,
      data: null,
    });
  }
};

function validateParams(query, rules) {
  const validParams = {};
  const errors = { required: "", normal: [] };

  Object.entries(rules).forEach(([key, rule]) => {
    let val = query[key] ?? (rule.required ? "" : undefined);

    // 1. 处理必填参数
    if (rule.required) {
      // 数字/浮点/大整型统一转Number，字符串去空格
      val = ["number", "float", "bigint"].includes(rule.type)
        ? Number(val)
        : val?.trim();

      if (
        !val ||
        (["number", "float", "bigint"].includes(rule.type) && isNaN(val))
      ) {
        errors.required = `${key}必填且需为${rule.type}类型`;
        return;
      }

      // 校验数值范围（min/max）
      if (rule.min && val < rule.min)
        errors.required = `${key}不能小于${rule.min}`;
      if (rule.max && val > rule.max)
        errors.required = `${key}不能大于${rule.max}`;

      if (errors.required) return;
      validParams[key] = val;
      return;
    }

    // 2. 处理非必填参数（无值则跳过）
    if (val === undefined || val === "" || val === 0) return;

    // 类型转换：数字/浮点/大整型转Number，字符串去空格
    val = ["number", "float", "bigint"].includes(rule.type)
      ? Number(val)
      : val.trim();

    let isInvalid = false;
    // 3. 数字/浮点/大整型参数校验
    if (["number", "float", "bigint"].includes(rule.type)) {
      if (isNaN(val)) {
        errors.normal.push(`${key}需为数字`);
        isInvalid = true;
      } else if (rule.min && val < rule.min) {
        errors.normal.push(`${key}不能小于${rule.min}`);
        isInvalid = true;
      }
    }
    // 4. 字符串参数校验（支持枚举）
    else if (rule.type === "string") {
      if (rule.enum && !rule.enum.includes(val)) {
        errors.normal.push(`${key}仅允许值：${rule.enum.join("、")}`);
        isInvalid = true;
      }
    }

    // 无错误则存入合法参数
    if (!isInvalid) validParams[key] = val;
  });

  return { validParams, errors };
}

// 纵横小说分页查询
exports.getZonghengBookList = async (req, res) => {
  try {
    const rules = {
      page: { type: "number", min: 1, required: true },
      size: { type: "number", min: 1, max: 100, required: true },
      gender: { type: "string", enum: ["male", "female"] },
      word_count: { type: "number", min: 0 },
      book_status: {
        type: "string",
        enum: ["连载中", "已完结"],
      },
      chapter_count: { type: "number", min: 0 },

      category: { type: "string" },
      total_click: { type: "number", min: 0 },
      total_recommend: { type: "number", min: 0 },
      weekly_recommend: { type: "number", min: 0 },
    };

    const { validParams, errors } = validateParams(req.query, rules);

    if (errors.required) {
      return res.status(400).json({
        code: 400,
        message: errors.required,
        data: null,
      });
    }

    const { page, size, ...filter } = validParams;
    const result = await novelModel.getZonghengBookList(page, size, filter);

    res.json({
      code: 200,
      message: errors.normal.length
        ? `获取成功，但参数错误：${errors.normal.join("；")}（已剔除非法参数）`
        : "获取纵横小说列表成功",
      data: result,
      paramErrors: errors.normal.length ? errors.normal : null,
    });
  } catch (error) {
    console.error("获取纵横小说列表失败：", error);
    res.status(500).json({
      code: 500,
      message: "获取纵横小说列表失败：" + error.message,
      data: null,
    });
  }
};

// 七猫小说分页查询（完整校验版）
exports.getQimaoBookList = async (req, res) => {
  try {
    const qimaoRules = {
      page: { type: "number", min: 1, required: true },
      size: { type: "number", min: 1, max: 100, required: true },
      gender: { type: "string", enum: ["male", "female"] },
      word_count: { type: "number", min: 0 },
      book_status: {
        type: "string",
        enum: ["连载中", "完结"],
      },
      chapter_count: { type: "number", min: 0 },
      
      category: { type: "string" },
      score: { type: "float", min: 0 },
      popularily: { type: "bigint", min: 0 },
      read_count: { type: "bigint", min: 0 },
    };

    const { validParams, errors } = validateParams(req.query, qimaoRules);

    if (errors.required) {
      return res.status(400).json({
        code: 400,
        message: errors.required,
        data: null,
      });
    }

    const { page, size, ...filter } = validParams;
    const result = await novelModel.getQimaoBookList(page, size, filter);

    res.json({
      code: 200,
      message: errors.normal.length
        ? `获取七猫小说列表成功，但参数错误：${errors.normal.join("；")}（已剔除非法参数）`
        : "获取七猫小说列表成功",
      data: result,
      paramErrors: errors.normal.length ? errors.normal : null,
    });
  } catch (error) {
    console.error("获取七猫小说列表失败：", error);
    res.status(500).json({
      code: 500,
      message: "获取七猫小说列表失败：" + error.message,
      data: null,
    });
  }
};

// 书旗小说分页查询
exports.getShuqiBookList = async (req, res) => {
  try {
    const shuqiRules = {
      page: { type: "number", min: 1, required: true },
      size: { type: "number", min: 1, max: 100, required: true },
      gender: { type: "string", enum: ["male", "female"] },
      word_count: { type: "number", min: 0 },
      book_status: {
        type: "string",
        enum: ["连载", "完结"],
      },
      chapter_count: { type: "number", min: 0 },
      category: { type: "string" },
      popularily: { type: "bigint", min: 0 },
    };

    const { validParams, errors } = validateParams(req.query, shuqiRules);

    if (errors.required) {
      return res.status(400).json({
        code: 400,
        message: errors.required,
        data: null,
      });
    }

    const { page, size, ...filter } = validParams;

    const result = await novelModel.getShuqiBookList(page, size, filter);

    res.json({
      code: 200,
      message: errors.normal.length
        ? `获取书旗小说列表成功，但参数错误：${errors.normal.join("；")}（已剔除非法参数）`
        : "获取书旗小说列表成功",
      data: result,
      paramErrors: errors.normal.length ? errors.normal : null,
    });
  } catch (error) {
    console.error("获取书旗小说列表失败：", error);
    res.status(500).json({
      code: 500,
      message: "获取书旗小说列表失败：" + error.message,
      data: null,
    });
  }
};

// 小说详情
exports.getNovelDetail = async (req, res) => {
  try {
    const { book_id, user_id, source } = req.query;

    if (!book_id || !user_id || !source) {
      return res.status(400).json({
        code: 400,
        msg: "缺少参数：book_id 和 user_id 不能为空",
      });
    }

    if (isNaN(book_id) || isNaN(user_id)) {
      return res.status(400).json({
        code: 400,
        msg: "参数错误：book_id 和 user_id 必须是数字",
      });
    }

    const validSources = ["qimao", "zongheng", "shuqi"];
    if (!validSources.includes(source)) {
      return res.status(400).json({
        code: 400,
        msg: "source 只能是 qimao、zongheng、shuqi 之一",
      });
    }

    const bookId = parseInt(book_id, 10);
    const userId = parseInt(user_id, 10);

    if (bookId <= 0 || userId <= 0) {
      return res.status(400).json({
        code: 400,
        msg: "参数非法：ID 必须大于 0",
      });
    }

    const data = await novelModel.getNovelDetail(userId, bookId, source);

    if (data) {
      await handleLRUUpdate(user_id, book_id, data.is_collect);
    }

    return res.json({
      code: 200,
      msg: "获取成功",
      data,
    });
  } catch (err) {
    console.error("小说详情接口错误：", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器异常，请稍后重试",
    });
  }
};

async function handleLRUUpdate(user_id, book_id, is_collect) {
  if (is_collect) {
    console.log(`用户 ${user_id} 打开了已收藏的书 ${book_id}，执行 LRU 置顶`);
    updateLastViewTime(user_id, book_id).catch(err => {
      console.error("LRU 更新失败:", err);
    });
  }
}

exports.getSearchBook = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        code: 400,
        msg: "请输入搜索内容",
      });
    }

    // 只调用这一个！
    const data = await novelModel.searchBooks(keyword);

    return res.json({
      code: 200,
      msg: "搜索成功",
      data,
    });

  } catch (err) {
    console.error("搜索错误:", err);
    return res.status(500).json({ code: 500, msg: "搜索失败" });
  }
};

exports.getMyBookshelf = async (req, res) => {
  try {
    const { user_id , keyword} = req.query;

    if (!user_id) {
      return res.status(400).json({
        code: 400,
        msg: "请传入用户ID",
      });
    }

    if (!keyword) {
      return res.status(400).json({
        code: 400,
        msg: "请输入搜索内容",
      });
    }

    // 调用同一个业务层，关键词传空字符串
    const data = await novelModel.searchMyBookshelf(user_id, keyword);

    return res.json({
      code: 200,
      msg: "我的书架查询成功",
      data,
    });

  } catch (err) {
    console.error("我的书架查询错误:", err);
    return res.status(500).json({ code: 500, msg: "我的书架查询失败" });
  }
};