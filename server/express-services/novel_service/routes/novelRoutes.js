const express = require("express");
const router = express.Router();
const novelController = require("../controllers/novelController");
const bookshelfController = require("../controllers/bookshelfController");
const loginController = require("../controllers/loginController");
const roleController = require("../controllers/roleController");
const bookController = require("../controllers/bookController");
const echartsController = require("../controllers/echartsController")
const qwenApiController = require("../controllers/qwenApiController")
const promptController = require("../controllers/promptController")
// 中间件
const auth = require('../utils/authMiddleware');


router.get("/book-source/list", novelController.getBookSourceList);

// 纵横小说分页查询接口
router.get("/zongheng/list", novelController.getZonghengBookList);

// 七猫小说分页查询接口
router.get("/qimao/list", novelController.getQimaoBookList);

// 书旗小说分页查询接口
router.get("/shuqi/list", novelController.getShuqiBookList);

// 查询小说详情
router.get('/detail', novelController.getNovelDetail); 

// 加入书库
router.post("/addToBookshelf", bookshelfController.addBookshelf); 

// 从书库移除
router.post("/removeFromBookshelf", bookshelfController.deleteBookshelf); 

// 查询我的书库书单（LRU排序）
router.get("/myBookshelfList", bookshelfController.getBookshelfList); 

// 搜索
router.get("/search", novelController.getSearchBook); 

// 我的书架搜索
router.get('/myBookSearch', novelController.getMyBookshelf);

// 阅读
router.get("/reading", bookshelfController.getReading);





// 登录鉴权+RBAC部分*********************************

// 登录
router.post("/login", loginController.login);

// 注册
router.post("/register", auth ,loginController.register);

// 删除用户（超级管理员权限）
router.post("/deleteUser", auth, loginController.deleteUser);

// 获取当前登录用户信息
router.get('/current-user', auth , loginController.getCurrentUser);

// 获取用户列表
router.get("/user", auth, loginController.getUserList);



// 超级管理员
// 查看用户角色
router.get("/roleList", auth, roleController.getUserRoleList);

// 给用户修改角色
router.post("/roleChange", auth, roleController.userRoleChange);


// 小说增删
// 新增小说接口
router.post('/book/add', auth, bookController.addBook);

// 删除小说接口
router.post('/book/delete', auth, bookController.deleteBook);

// 可视化
// 分类分析
router.get('/echarts/category/zongheng' , auth , echartsController.getEchartsCategoryZongheng)
router.get('/echarts/category/qimao' , auth , echartsController.getEchartsCategoryQimao)
router.get('/echarts/category/shuqi' , auth , echartsController.getEchartsCategoryShuqi)

// 内容分析
// 字数维度
router.get('/echarts/content/word_count' , auth , echartsController.getEchartsContentWordcount)
router.get('/echarts/content/word_count/status' , auth , echartsController.getEchartsContentWordcountStatus)
// 状态维度
router.get('/echarts/content/status' , auth , echartsController.getEchartsContentStatus)
// 性别维度
router.get('/echarts/content/gender' , auth , echartsController.getEchartsContentGender)
router.get('/echarts/content/gender/word_count' , auth , echartsController.getEchartsContentGenderWordCount)
// 章节维度
router.get('/echarts/content/chaptor/word_count' , auth , echartsController.getEchartsContentChaptorWordCount)
router.get('/echarts/content/chaptor/average' , auth , echartsController.getEchartsContentAverage)

// 热度维度
// 常规维度接口（和top10无关）
// 纵横 - 分类*周订阅
router.get('/echarts/popularity/zongheng/category/weekly/subscribe', auth, echartsController.getEchartsPopularityZonghengCategoryWeeklySubscribe)
// 纵横 - 分类*总订阅
router.get('/echarts/popularity/zongheng/category/total/subscribe', auth, echartsController.getEchartsPopularityZonghengCategoryTotalSubscribe)
// 纵横 - 点击*订阅
router.get('/echarts/popularity/zongheng/click/subscribe', auth, echartsController.getEchartsPopularityZonghengClickSubscribe)
// 纵横 - 点击订阅top10（独立top10接口）
router.get('/echarts/ranking/zongheng/top10/click_subscribe', auth, echartsController.getEchartsRankingZonghengTop10ClickSubscribe)

// 七猫 - 分类*阅读数
router.get('/echarts/popularity/qimao/category/read_count', auth, echartsController.getEchartsPopularityQimaoCategoryReadCount)
// 七猫 - 分类*评分
router.get('/echarts/popularity/qimao/category/score', auth, echartsController.getEchartsPopularityQimaoCategoryScore)
// 七猫 - 阅读数*评分
router.get('/echarts/popularity/qimao/read_count/score', auth, echartsController.getEchartsPopularityQimaoReadCountScore)
// 七猫 - 阅读数评分top10（独立top10接口）
router.get('/echarts/ranking/qimao/top10/readcount_score', auth, echartsController.getEchartsRankingQimaoTop10ReadcountScore)

// 书旗 - 分类*人气值
router.get('/echarts/popularity/shuqi/category/popularity_value', auth, echartsController.getEchartsPopularityShuqiCategoryPopularityValue)
// 书旗 - 分类人气值top10（独立top10接口）
router.get('/echarts/ranking/shuqi/top10/category_popularity', auth, echartsController.getEchartsRankingShuqiTop10CategoryPopularity)


// AI
router.post('/qwen/chat/answer',auth, qwenApiController.getQwenChatAnswer);



// Prompt
router.get('/prompt/search' , auth , promptController.getLatestPromptConfig)
router.post('/prompt/edit' , auth , promptController.updatePromptConfig)

module.exports = router;
