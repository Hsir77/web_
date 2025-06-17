// 1.安装 npm i express
// 2.导入
const express = require('express');
// 3.创建一个应用对象
const app = express();

// 解析post参数
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 4.创建路由
app.get('/home', (req, res) => {
	console.log(req.url); //请求地址
	console.log(req.httpVersion); //协议版本号
	console.log(req.headers); //请求头
	console.log(req.path); //请求路径
	console.log(req.query); //参数对象 查询字符串
	console.log(req.ip); //ip地址

	res.send('hello');
});

app.post('/login', (req, res) => {
	console.log(req.body); //参数对象 查询字符串
	res.send('hello');
});

app.all('/sut', (req, res) => {
	res.send('hello all');
});

// 匹配所有方法
// app.all("*", (req, res) => {
//   res.send("哈喽");
// });//会拦截下面的路径

app.post('/time', (req, res) => {
	console.log(req.body); //参数对象 查询字符串
	res.send('hello');
});

app.get('/:id', (req, res) => {
	console.log(req.params); //查询路由参数
	res.send('hello');
});

// 5.监听端口 启动服务
app.listen(8080, () => {
	console.log('run.......');
});
