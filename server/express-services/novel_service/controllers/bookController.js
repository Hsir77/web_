const { execFile } = require("child_process");
const util = require("util");
const path = require("path");
const bookModel = require("../models/bookModel");

const execFileAsync = util.promisify(execFile);

async function addBook(req, res) {
  try {
    if (!req.user.permissions.includes("novel:add")) {
      return res.status(403).json({
        message: "当前用户没有权限",
      });
    }
    const { url, source, gender } = req.body;

    // 1. 必填校验
    if (!url || !source || !gender) {
      return res.status(400).json({
        code: 400,
        message: "url、source、gender 均为必填",
      });
    }

    // 2. source 合法性校验
    const allowSources = ["qimao", "zongheng", "shuqi"];
    if (!allowSources.includes(source)) {
      return res.status(400).json({
        code: 400,
        message: "source 只能是 qimao、zongheng、shuqi",
      });
    }

    // 3. URL + source 格式校验
    const urlRule = {
      zongheng: /^https?:\/\/www\.zongheng\.com\/detail\/\d+\/?$/,
      qimao: /^https?:\/\/www\.qimao\.com\/shuku\/\d+\/?$/,
      shuqi: /^https?:\/\/www\.shuqi\.com\/book\/\d+\.html$/,
    };
    if (!urlRule[source].test(url)) {
      return res.status(400).json({
        code: 400,
        message: "URL 格式与来源不匹配",
      });
    }

    // 4. 执行Python爬虫
    const pythonWorkDir =
      "D:\\桌面文件\\web_\\server\\python-services\\novel_spider";
    const pythonModule = `novel_spider.node_spider.${source}_book_add`;
    const cmdArgs = ["run", "python", "-m", pythonModule, url, source, gender];

    console.log("【Poetry 参数数组】", cmdArgs);
    const { stdout, stderr } = await execFileAsync("poetry", cmdArgs, {
      cwd: pythonWorkDir,
      encoding: "utf8",
      windowsHide: true,
    });

    console.log("【Python 输出】", stdout);
    console.log("【Python 错误】", stderr);

    // 5. 解析Python返回数据
    const lines = stdout.trim().split("\n");
    const lastLine = lines.pop();
    const crawlResult = JSON.parse(lastLine);

    if (crawlResult.code !== 0) {
      return res.status(500).json({
        code: 500,
        message: "爬取失败",
        error: crawlResult.message,
      });
    }

    // 6. 调用createBook（传普通对象，不是req/res）
    const result = await createBook({
      url,
      source,
      gender,
      crawlData: crawlResult.data,
    });

    return res.json({
      code: 200,
      message: "添加小说成功",
      data: result,
    });
  } catch (err) {
    console.error("添加小说失败", err);
    return res.status(500).json({
      code: 500,
      message: "服务器内部错误",
      detail: err.message,
    });
  }
}

// 解析book_id工具函数
function getBookId(url, source) {
  let book_id = null;
  switch (source) {
    case "zongheng":
      book_id = (url.match(/zongheng\.com\/detail\/(\d+)/) || [])[1];
      break;
    case "qimao":
      book_id = (url.match(/qimao\.com\/shuku\/(\d+)/) || [])[1];
      break;
    case "shuqi":
      book_id = (url.match(/shuqi\.com\/book\/(\d+)\.html/) || [])[1];
      break;
  }
  if (!book_id) throw new Error("book_id 解析失败");
  return book_id;
}

async function createBook(params) {
  try {
    const { url, source, gender, crawlData } = params; // ✅ 改这里，从params取数

    // 1. 解析book_id
    const book_id = getBookId(url, source);

    // 2. 存入book_source（只传5个字段）
    const sourceParams = {
      name: crawlData.base_info.book_name,
      source: source,
      url: url,
      book_id: book_id,
      gender: gender,
    };
    await bookModel.insertBookSource(sourceParams);

    const base = crawlData.base_info;
    const catalog = crawlData.chapter_catalog;
    const content = crawlData.chapter_content;

    // 3. 按平台存入对应表
    if (source === "zongheng") {
      const zonghengData = {
        book_id: book_id,
        book_name: base.book_name,
        author_name: base.author_name,
        book_status: base.book_status,
        category: base.category,
        word_count: base.word_count,
        book_intro: base.book_intro,
        cover_url: base.cover_url,
        total_click: base.total_click,
        total_recommend: base.total_recommend,
        weekly_recommend: base.weekly_recommend,
        chapter_count: catalog.chapter_count,
        chapter_catalog: catalog.chapter_catalog,
        chapter1: content.chapter1,
        chapter2: content.chapter2,
        chapter3: content.chapter3,
      };
      await bookModel.insertZonghengBookData(zonghengData);
    } else if (source === "qimao") {
      const qimaoData = {
        book_id: book_id,
        book_name: base.book_name,
        author_name: base.author_name,
        book_status: base.book_status,
        category: base.category,
        word_count: base.word_count,
        read_count: base.read_count,
        popularity: base.popularity,
        score: base.score,
        book_intro: base.book_intro,
        cover_url: base.cover_url,
        chapter_count: catalog.chapter_count,
        chapter_catalog: catalog.chapter_catalog,
        chapter1: content.chapter1,
        chapter2: content.chapter2,
        chapter3: content.chapter3,
      };
      await bookModel.insertQimaoBookData(qimaoData);
    } else if (source === "shuqi") {
      const shuqiData = {
        book_id: book_id,
        book_name: base.book_name,
        author_name: base.author_name,
        book_status: base.book_status,
        category: base.category,
        word_count: base.word_count,
        popularity: base.popularity,
        book_intro: base.book_intro,
        cover_url: base.cover_url,
        chapter_count: catalog.chapter_count,
        chapter_catalog: catalog.chapter_catalog,
      };
      await bookModel.insertShuqiBookData(shuqiData);
    }

    // ✅ 改这里：返回数据，不是res.json
    return {
      book_id,
      message: "保存成功",
    };
  } catch (err) {
    console.error("createBook失败：", err);
    throw err; // 抛给上层addBook处理异常
  }
}

// 删除小说接口
async function deleteBook(req, res) {
  try {
    if (!req.user.permissions.includes("novel:delete")) {
      return res.status(403).json({
        message: "当前用户没有权限",
      });
    }
    const { source, url, book_name } = req.body;

    // 1. 来源校验
    const allowSources = ["zongheng", "qimao", "shuqi"];
    if (!source || !allowSources.includes(source)) {
      return res.status(400).json({
        code: 400,
        message: "source 必传，且只能是 zongheng、qimao、shuqi",
      });
    }

    // 2. 必须传一种删除条件
    const hasUrl = !!url;
    const hasName = !!book_name;
    if (!hasUrl && !hasName) {
      return res.status(400).json({
        code: 400,
        message: "必须传入 url 或 book_name",
      });
    }

    // 3. 查询小说
    let bookRecord;
    if (hasUrl) {
      bookRecord = await bookModel.findBookBySourceAndUrl(source, url);
    } else {
      bookRecord = await bookModel.findBookBySourceAndName(source, book_name);
    }

    if (!bookRecord) {
      return res.status(404).json({
        code: 404,
        message: "未找到该小说",
      });
    }

    const book_id = bookRecord.book_id;

    // 4. 执行删除
    await bookModel.deleteBookTransaction(source, book_id);

    return res.json({
      code: 200,
      message: "删除小说成功",
      data: {
        source,
        book_id,
        delete_by: hasUrl ? "url" : "book_name",
      },
    });
  } catch (err) {
    console.error("删除小说失败", err);
    return res.status(500).json({
      code: 500,
      message: "服务器内部错误",
      detail: err.message,
    });
  }
}

module.exports = {
  addBook,
  deleteBook,
};
