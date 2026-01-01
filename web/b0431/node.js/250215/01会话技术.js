let express = require('express');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let app = express();

app.use(cookieParser());

let config = {
	secret: '123456', // 加密字符串
	resave: false, // 强制保存
	saveUninitialized: false, // 强制保持未初始化的session
};

app.use(session(config));

app.get('/get', (req, res) => {
	res.cookie('test', '测试信息');
	res.cookie('dome', '123456', { expires: new Date(Date.now() + 1000 * 5) });
	console.log(req.cookies);
	res.clearCookie('dome');
	res.send('123');
});

app.get('/test', (req, res) => {
	req.session.name = '张三';
	req.session.isLogin = true;
	console.log(req.session);
	res.send('test');
});

app.get('/index', (req, res) => {
	console.log(req.session);
	res.send('index');
});

app.listen(8006, () => {
	console.log('run......');
});
