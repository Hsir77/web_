/**
 * 1. 搭建服务器 监听端口8080
 * 2. 生成假数据[{ },{ },{ }]
 * 3. 渲染 利用 template npm i art - template
 * 4. 读取文件template.render(html,{list:arr})
 * 5. 访问首页时渲染
 * 6. 处理二次请求 判断地址是否是css 读取css文件
 */
let arr = [
	{ name: '张三', content: '中午吃什么', time: '2025/2/13' },
	{ name: '张四', content: '中午吃什么', time: '2025/2/13' },
	{ name: '张五', content: '中午吃什么', time: '2025/2/13' },
	{ name: '张六', content: '中午吃什么', time: '2025/2/13' },
];

let http = require('http');
let fs = require('fs');
let path = require('path');
let url = require('url');
let queryString = require('querystring');
let template = require('art-template');

http.createServer((req, res) => {
	let obj = url.parse(req.url, true); //如果写第二个参数且为true的话，他会把query部分转为对象返回
	console.log(obj.pathname);
	if (obj.pathname === '/') {
		fs.readFile(path.join(__dirname, '/留言本_files/index.html'), 'utf-8', (err, data) => {
			if (err) {
				return res.end('404');
			}
			let str = template.render(data, { list: arr });
			res.end(str);
		});
	} else if (obj.pathname === '/public/bootstrap.css') {
		let meCss = fs.readFileSync(path.join(__dirname, '/留言本_files/public/bootstrap.css'));
		res.end(meCss);
	}

	if (obj.pathname === '/post') {
		let post = fs.readFileSync(path.join(__dirname, '/留言本_files/post.html'));
		res.end(post);
	}
	if (obj.pathname === '/get') {
		let query = url.parse(req.url).query;

		let obj1 = queryString.parse(query);
		arr.unshift(obj1);
		console.log(arr);
		res.setHeader('Location', '/');
		res.statusCode = '302';
		res.end();
	}
}).listen(8080, () => {
	console.log('run.....');
});
