const bookshelfModel = require("../models/bookshelfModel");

// 1. 加入书架（收藏）
async function addBookshelf(req, res) {
  try {
    const { user_id, book_id, source } = req.body;

    if (!user_id || !book_id || !source) {
      return res.status(400).json({
        code: 400,
        msg: "缺少参数：user_id、book_id、source 不能为空",
      });
    }

    const validSources = ["qimao", "zongheng", "shuqi"];
    if (!validSources.includes(source)) {
      return res.status(400).json({
        code: 400,
        msg: "source 只能是 qimao、zongheng、shuqi 之一",
      });
    }

    const result = await bookshelfModel.addBookshelf(user_id, book_id, source);

    return res.json({
      code: 200,
      msg: "加入书架成功",
      data: result,
    });
  } catch (err) {
    console.error("加入书架接口异常：", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器异常",
    });
  }
}

// 2. 删除书架（取消收藏）
async function deleteBookshelf(req, res) {
  try {
    const { user_id, book_id } = req.body;

    if (!user_id || !book_id) {
      return res.status(400).json({
        code: 400,
        msg: "缺少参数：user_id、book_id 不能为空",
      });
    }

    const result = await bookshelfModel.deleteBookshelf(user_id, book_id);

    return res.json({
      code: 200,
      msg: "取消收藏成功",
      data: result,
    });
  } catch (err) {
    console.error("删除书架接口异常：", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器异常",
    });
  }
}

// 3. 查询我的书架（书单列表）
async function getBookshelfList(req, res) {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({
        code: 400,
        msg: "缺少参数：user_id 不能为空",
      });
    }

    const list = await bookshelfModel.getBookshelfList(user_id);

    return res.json({
      code: 200,
      msg: "获取成功",
      data: list,
    });
  } catch (err) {
    console.error("查询书架列表异常：", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器异常",
    });
  }
}

async function getReading(req, res) {
  try {
    const { book_id, source } = req.query;

    if (!book_id || !source) {
      return res.status(400).json({
        code: 400,
        msg: "缺少参数：book_id 或 source 不能为空",
      });
    }

    const allowSources = [ "qimao", "zongheng"];
    if (!allowSources.includes(source)) {
      return res.status(400).json({
        code: 400,
        msg: "非法 source",
      });
    }

    const chapters = await bookshelfModel.getTrialChapters(book_id, source);

    if (!chapters || chapters.length === 0) {
      return res.status(404).json({
        code: 404,
        msg: "未找到试读内容",
      });
    }

    return res.json({
      code: 200,
      msg: "获取成功",
      data: {
        book_id,
        source,
        is_trial: true,
        total_chapters: chapters.length,
        chapters,
      },
    });
  } catch (err) {
    console.error("获取试读内容异常：", err);
    return res.status(500).json({
      code: 500,
      msg: "服务器异常",
    });
  }
}

module.exports = {
  addBookshelf,
  deleteBookshelf,
  getBookshelfList,
  getReading,
};
