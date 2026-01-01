const mongoose = require('mongoose');
// 建立一个链接，在本地地址创建一个叫 test 的数据库
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/bo431');
// 生成mongoose模型
module.exports = mongoose.model('stus', {
	name: {
		type: String,
		require: true, // 必填项
	},
	content: {
		type: String,
		require: true, // 必填项
	},
	timer: {
		type: String,
		require: true, // 必填项
	},
	sex: {
		type: String,
		require: true, // 必填项
	},
});
