//http协议 超文本传输协议
const http = require('http');
//2.创建服务对象
//创建服务对象                    请求      响应
const server = http.createServer((request, response) => {
	response.end('hello world');
});
server.listen(8080, () => {
	console.log('已经启动');
});
//停止服务 ctrl+c
//代码更新需重启服务
//响应头设置中文会乱码
