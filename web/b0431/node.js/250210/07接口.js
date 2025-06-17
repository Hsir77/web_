// 127.0.0.1:8000/get
// name=xx,age=xxx
// {name,age,_t_time}
const http = require('http');
const url = require('url');
const queryString = require('querystring'); //将网址上的参数转成对象

// 2.创建服务对象 createServer 创建服务请求 响应
http.createServer((req, res) => {
	res.setHeader('content-type', 'text/html;charset=utf-8');

	//url.parse截取网址/之后的内容
	let query = url.parse(req.url).query; // 获取地址上的参数
	console.log(query);
	let pathname = url.parse(req.url).pathname; // 获取接口地址
	console.log(url.parse(req.url));
	if (pathname === '/get' && req.method === 'GET') {
		let obj = queryString.parse(query); // 把参数转换成对象
		console.log(queryString.parse(query));
		obj._t_ = Date.now();
		res.end(JSON.stringify(obj));
	} else if (pathname === '/post' && req.method === 'POST') {
		let data = '';
		req.on('data', (chunk) => {
			data += chunk;
		});
		req.on('end', () => {
			console.log(data);
			let str = { ...queryString.parse(data), _t_: Date.now() };
			res.end(JSON.stringify(str));
		});
	}
	// console.log(query, pathname);
	//设置响应头并结束响应
})
	//监听端口 启动服务
	.listen(8000, () => {
		console.log('服务已经启动');
	});
