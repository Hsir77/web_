
const echartsModel = require("../models/echartsModel");

//分类分析
async function getEchartsCategoryZongheng(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getCategoryStatsZongheng();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
async function getEchartsCategoryQimao(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getCategoryStatsQimao();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
async function getEchartsCategoryShuqi(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getCategoryStatsShuqi();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}

// 内容分析
// 字数维度
async function getEchartsContentWordcount(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentWordcount();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
async function getEchartsContentWordcountStatus(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentWordcountStatus();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 状态维度
async function getEchartsContentStatus(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentStatus();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 性别维度
async function getEchartsContentGender(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentGender();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
async function getEchartsContentGenderWordCount(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentGenderWordCount();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 章节维度
async function getEchartsContentChaptorWordCount(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentChaptorWordCount();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
async function getEchartsContentAverage(req, res) {
   try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsContentAverage();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}

// 热度分析
// 纵横 - 分类*周订阅
async function getEchartsPopularityZonghengCategoryWeeklySubscribe(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityZonghengCategoryWeeklySubscribe();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 纵横 - 分类*总订阅
async function getEchartsPopularityZonghengCategoryTotalSubscribe(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityZonghengCategoryTotalSubscribe();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 纵横 - 点击*订阅
async function getEchartsPopularityZonghengClickSubscribe(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityZonghengClickSubscribe();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 纵横 - 点击订阅top10（独立top10接口）
async function getEchartsRankingZonghengTop10ClickSubscribe(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsRankingZonghengTop10ClickSubscribe();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 七猫 - 分类*阅读数
async function getEchartsPopularityQimaoCategoryReadCount(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityQimaoCategoryReadCount();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 七猫 - 分类*评分
async function getEchartsPopularityQimaoCategoryScore(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityQimaoCategoryScore();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 七猫 - 阅读数*评分
async function getEchartsPopularityQimaoReadCountScore(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityQimaoReadCountScore();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 七猫 - 阅读数评分top10（独立top10接口）
async function getEchartsRankingQimaoTop10ReadcountScore(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsRankingQimaoTop10ReadcountScore();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 书旗 - 分类*人气值
async function getEchartsPopularityShuqiCategoryPopularityValue(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsPopularityShuqiCategoryPopularityValue();
    res.json({
      code: 200,
      message: "success",
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      code: 500,
      message: "服务器错误"
    });
  }
}
// 书旗 - 分类人气值top10（独立top10接口）
async function getEchartsRankingShuqiTop10CategoryPopularity(req, res) {
  try {
    if (!req.user.permissions.includes("analysis:view")) {
      return res.status(403).json({
        message: "当前用户没有权限"
      });
    }
    const data = await echartsModel.getEchartsRankingShuqiTop10CategoryPopularity();
    res.json({
      code: 200,
      message: "success",
      data
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
  getEchartsCategoryZongheng,
  getEchartsCategoryQimao,
  getEchartsCategoryShuqi,
  getEchartsContentWordcount,
  getEchartsContentWordcountStatus,
  getEchartsContentStatus,
  getEchartsContentGender,
  getEchartsContentGenderWordCount,
  getEchartsContentChaptorWordCount,
  getEchartsContentAverage,
  getEchartsPopularityZonghengCategoryWeeklySubscribe,
  getEchartsPopularityZonghengCategoryTotalSubscribe,
  getEchartsPopularityZonghengClickSubscribe,
  getEchartsRankingZonghengTop10ClickSubscribe,
  getEchartsPopularityQimaoCategoryReadCount,
  getEchartsPopularityQimaoCategoryScore,
  getEchartsPopularityQimaoReadCountScore,
  getEchartsRankingQimaoTop10ReadcountScore,
  getEchartsPopularityShuqiCategoryPopularityValue,
  getEchartsRankingShuqiTop10CategoryPopularity
};