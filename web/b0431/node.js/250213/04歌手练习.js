// 1.安装 npm i express
// 2.导入
const express = require('express');
const fs = require('fs');
const path = require('path');
// 3.创建一个应用对象
const app = express();

// 解析post参数
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 读取歌手数据
const singersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'singer.json'), 'utf-8'));
console.log(singersData.singers.length);

app.get('/:id', (req, res) => {
	let newid = req.params.id.slice(1);
	console.log(newid);
	for (let i = 0; i < singersData.singers.length; i++) {
		if (singersData.singers[i].id == newid) {
			singerPic1 = singersData.singers[i].singer_pic;
			res.send(`<img src="${singerPic1}" alt="">`);
		}
	}
});

app.listen(8080, () => {
	console.log('run.......');
});
