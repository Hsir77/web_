/**
 * 需求 复制文件座右铭.txt
 */
const fs = require('fs');

// 方法1
// 读取文件内容
// let data = fs.readFileSync('./座右铭.txt');
// 写入文件
// fs.writeFileSync('./座右铭-2.txt', data);

// fs.copyFile("./座右铭.txt", "./a.txt", (err) => {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     console.log("复制成功");
// });

// 文件夹操作
// 1.创建文件夹 mk make制作 dir directory 文件夹
// fs.mkdir("./html", (err) => {
//     if (err) {
//         console.log("文件夹创建失败");
//         return;
//     }
//     console.log("创建成功");
// });

// 文件夹递归创建
// fs.mkdir('./a/b/c', { recursive: true }, (err) => {
// 	if (err) {
// 		console.log('创建文件夹失败');
// 		return;
// 	}
// 	console.log('创建成功');
// });

// 读取文件夹
// fs.readdir("./day01", (err, data) => {
//     if (err) {
//         console.log("读取失败");
//         return;
//     }
//     console.log(data);
// });

// 删除文件夹
// fs.rmdir("./html", (err) => {
//     if (err) {
//         console.log("删除失败");
//         return;
//     }
//     console.log("删除成功");
// });

// fs.rmdir("./a", { recursive: true }, (err) => {
//     if (err) {
//         console.log("删除失败");
//         return;
//     }
//     console.log("删除成功");
// });

// 推荐使用
// fs.rm('./a', { recursive: true }, (err) => {
// 	if (err) {
// 		console.log('删除失败');
// 		return;
// 	}
// 	console.log('删除成功');
// });

fs.stat('./03fs模块文件操作.js', (err, data) => {
	if (err) {
		console.log('查找失败');
		return;
	}
	console.log(data);
});
//  //  size 文件大小
//  atime 最后访问时间
//  mtime 最后一次修改文件夹状态的时间
//  birthtime 文件创建时间
//  console.log(data.isFile());//目标资源是否是一个文件
//  console.log(data.isDirectory());//目标资源是否是一个文件夹
