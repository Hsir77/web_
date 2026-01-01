const mongoose = require('mongoose');
//建立一个链接，在本地地址创建一个叫 test 的数据库

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/test');
//生成mongoose模型
//在test数据库中创建一个叫cats的表(mongo规则会把表明变成小写并且后边追加s)
//在cats表中对数据进行约束
const Cat = mongoose.model('Cat', { name: String });
//向数据库添加数据，使用数据库模型添加，并调用相关方法写入
const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));
kitty.save(function (error) {
	if (error) {
		console.log(error);
	} else {
		console.log('meow');
	}
});
