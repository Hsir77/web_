let express = require('express');
let router = express.Router();
let Stu = require('./student');

// router.get("/students", (req, res) => {
//     res.render("index.html", { list: ["香蕉", "西瓜", "橘子", "芒果"] });
// });
// 首页
router.get('/students', (req, res) => {
	Stu.findAll((err, data) => {
		if (err) {
			res.send('404');
		}
		res.render('index.html', {
			list: ['香蕉', '西瓜', '橘子', '芒果'],
			students: data,
		});
	});
});

router.get('/student/add', (req, res) => {
	res.render('new.html');
});

router.post('/students/add', (req, res) => {
	let data = req.body;
	console.log(data);
	Stu.add(data, (e) => {
		if (e) {
			res.send('404');
		}
		res.redirect('/students');
	});
});

router.get('/student/delete', (req, res) => {
	let data1 = req.query.id;

	Stu.delete(data1, (e) => {
		if (e) {
			res.send('404');
		}
		res.redirect('/students');
	});
});

router.get('/studnt/edit', (req, res) => {
	let data1 = req.query.id;
	console.log(data1);
	Stu.search(data1, (e, data) => {
		if (e) {
			res.send('404');
		}

		console.log(data);
		res.render('edit.html', {
			arr: data,
		});
	});
});

router.post('/students/edit', (req, res) => {
	let data1 = req.body;

	Stu.revise(data1, (e, data) => {
		if (e) {
			res.send('404');
		}
	});
	res.redirect('/students');
});

module.exports = router;
