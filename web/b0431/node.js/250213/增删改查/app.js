const express = require('express');
let router = require('./router');

let app = express();

// 解析post参数
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// 使用模板
app.engine('html', require('express-art-template'));

// 处理静态资源
app.use('/public', express.static('./public/'));
app.use('/node_modules', express.static('../node_modules'));

app.use(router);

app.listen(8000, () => {
	console.log('run......');
});
