//fs是用来操作文件系统的模块
//fs可以实现与硬盘交互
const fs = require('fs');
//writefile是覆盖写入
// fs.writeFile('./座右铭.txt', 'hello', (err) => {
// 	if (err) {
// 		console.log('失败');
// 		return;
// 	}
// 	console.log('成功');
// });

// fs.writeFileSync('./data.txt', 'test');

//追加写入

// fs.appendFile('./座右铭.txt', 'node.js', (err) => {
// 	if (err) {
// 		console.log('失败');
// 		return;
// 	}
// 	console.log('成功');
// });

// fs.writeFile('./座右铭.txt', '666', { flag: 'a' }, (err) => {
// 	if (err) {
// 		console.log('失败');
// 		return;
// 	}
// 	console.log('right');
// });

//文件读取
fs.readFile('./座右铭.txt', (err, data) => {
	if (err) {
		console.log('文件读取失败');
		return;
	}
	console.log(data.toString());
});
