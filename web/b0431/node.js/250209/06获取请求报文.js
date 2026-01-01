const http = require('http');
const url = require('url');
const server = http.createServer((req, res) => {
	res.setHeader('content-type', 'text/html;charset=utf-8');
	console.log(req.method); //获取请求方式
	console.log(req.url); //获取请求的url
	console.log(req.httpVersion); //获取http协议版本号
	res.end('请求结束');
});
server.listen(9001, () => {
	console.log('已启动');
});
