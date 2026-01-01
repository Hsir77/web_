const http = require('http');
const url = require('url');
const server = http.createServer((req, res) => {
	res.setHeader('content-type', 'text/html;charset=utf-8');
	if (req.method == 'GET') {
		if (req.url == '/login') {
			res.end('登录页面');
		} else {
			res.end('注册页面');
		}
	}
});
server.listen(9001, () => {
	console.log('已启动');
});
