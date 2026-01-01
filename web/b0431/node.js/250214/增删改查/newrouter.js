let express = require('express');
let router = express.Router();
let Stu = require('./db.js');

// router.get("/students", (req, res) => {
//   res.render("index.html", { list: ["香蕉", "西瓜", "橘子", "芒果"] });
// });
// 首页
router.get('/students', async (req, res) => {
	console.log(1);
	let data = await Stu.find();
	res.render('index.html', {
		list: ['香蕉', '西瓜', '橘子', '芒果'],
		students: data,
	});
});

router.get('/student/add', (req, res) => {
	res.render('new.html');
});

router.post('/students/add', (req, res) => {
	let data = req.body;
	new Stu(data).save().then(() => {
		res.redirect('/students');
	});
});

router.get('/student/delete', async (req, res) => {
	let data1 = req.query.id;
	await Stu.findByIdAndRemove(data1.id);
	res.redirect('/students');
});

// Stu.findById(id)
router.get('/studnt/edit', async (req, res) => {
	let msg = await Stu.findById(req.query.id);
	res.render('edit.html', { arr: msg });
});

// Stu.findByIdAndUpdata(id,data)
router.post('/students/edit', async (req, res) => {
	await Stu.findByIdAndUpdate(req.body.id, req.body);
	res.redirect('/students');
});
module.exports = router;
