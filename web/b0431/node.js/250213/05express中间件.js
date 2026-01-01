// 需求：在调用某个接口时，打印出调用者的ip地址及调用地址
const express = require('express');
const fs = require('fs');
const app = express();

// 声明中间件
// req 请求报文对象 res 响应报文对象 next 一个内部函数 函数执行后指向后续路由或者中间件函数回调
function log(req, res, next) {
	let { url, ip } = req;
	fs.appendFileSync(__dirname + '/access.log', `${url}${ip}\r\n`);
	next();
}

let code = (req, res, next) => {
	if (req.query.code === '123') {
		next();
	} else {
		res.send('暗号错误');
	}
};

// 使用中间件
app.use(log);

app.get('/home', (req, res) => {
	res.send('hello');
});

app.get('/admin', (req, res) => {
	res.send('hello');
});

app.get('/setting', code, (req, res) => {
	res.send('后台首页');
});

app.get('/login', code, (req, res) => {
	res.send('登录页面');
});

app.all('*', (req, res) => {
	res.send('404');
});

app.listen(8080, () => {
	console.log('run.....');
});
