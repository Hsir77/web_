const http = require('http');
const fs = require('fs');
const path = require('path');

let mimes = {
	html: 'text/html',
	css: 'text/css',
	js: 'text/javascript',
	png: 'image/png',
	jpg: 'image/jpeg',
	gif: 'image/gif',
	mp4: 'video/mp4',
	mp3: 'audio/mpeg',
	json: 'text/application/json',
};
// 2.创建服务对象 createServer 创建服务请求 响应
http.createServer((request, response) => {
	let url = request.url;
	console.log(url);
	let root = __dirname + '/03page';
	let filePage = root + url;
	console.log(filePage);
	fs.readFile(filePage, (err, data) => {
		if (err) {
			response.setHeader('content-type', 'text/html;charset=utf-8');
			response.end('文件读取错误');
			return;
		}
		// 获取文件后缀名
		let ext = path.extname(filePage).slice(1);
		let type = mimes[ext];
		console.log(type);
		if (type) {
			response.setHeader('content-type', type + ';charset=utf-8');
		} else {
			response.setHeader('content-type', 'text/html;charset=utf-8');
		}
		response.end(data);
	});
	// response.end("你好，世界"); //设置响应头并结束响应
}).listen(8080, () => {
	console.log('服务已经启动');
});
