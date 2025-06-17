const fs = require('fs');
//用来操作路径
const path = require('path');
fs.writeFileSync(__dirname + 'index.html', 'hello!!!');
// console.log(__dirname + 'index.html');
// //resolve 作用 拼接规范的绝对路径
// console.log(path.resolve(__dirname + './index.html'));
//  //sep 分隔符 不同系统下路径分隔符不同
//  console.log(path.sep);
//  //windows \
//  //linux /

let str = 'E:\\ed浏览器下载\\Release 2.6.7\\PCL\\Pictures';
console.log(path.parse(str));
//用来解析路径
