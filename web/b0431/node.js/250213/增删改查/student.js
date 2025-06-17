const fs = require('fs');

// 查询学生
exports.findAll = (callback) => {
	fs.readFile('./db.json', 'utf-8', (err, data) => {
		if (err) {
			return callback(err, null);
		}
		data = JSON.parse(data);
		console.log(data);
		data = data.arr;
		callback(null, data);
	});
}; // 添加学生
exports.add = (student, callback) => {
	// 1.读文件
	fs.readFile('./db.json', 'utf-8', (err, data) => {
		// 2.判断读取文件阶段是否错误
		if (err) {
			return callback(err);
		}

		// 3.取数据
		data = JSON.parse(data).arr;
		let length = data.length;
		console.log(data);
		console.log(length);
		// 4.拿到数组长度，生成动态id
		if (length > 0) {
			length -= 1;
			student.id = parseInt(data[length].id + 1);
		}
		data.push(student);
		let filedata = {
			arr: data,
		};
		filedata = JSON.stringify(filedata);
		// 5.把数据添加到文件
		fs.writeFile('./db.json', filedata, (err, data) => {
			if (err) return callback(err);
			callback(null);
		});
	});
};

exports.delete = (student, callback) => {
	fs.readFile('./db.json', 'utf-8', (err, data) => {
		if (err) {
			return callback(err);
		}
		let newdb = JSON.parse(data);

		let studentsarr = newdb.arr;

		let k = -1;
		for (let i = 0; i < studentsarr.length; i++) {
			if (studentsarr[i].id == student) {
				k = i;
				break;
			}
		}

		studentsarr.splice(k, 1);
		for (let i = 0; i < studentsarr.length; i++) {
			studentsarr[i].id = i;
		}

		newdb.arr = studentsarr;
		let filedata = JSON.stringify(newdb);
		fs.writeFile('./db.json', filedata, (err, data) => {
			if (err) return callback(err);
			callback(null);
		});
	});
};

exports.search = (student, callback) => {
	fs.readFile('./db.json', 'utf-8', (err, data) => {
		if (err) {
			return callback(err);
		}
		let newdb = JSON.parse(data).arr;
		let nowdata = newdb[student];

		callback(null, nowdata);
	});
};

exports.revise = (student, callback) => {
	fs.readFile('./db.json', 'utf-8', (err, data) => {
		if (err) {
			return callback(err);
		}

		let newdata = JSON.parse(data).arr;

		for (let i = 0; i < newdata.length; i++) {
			if (student.id == newdata[i].id) {
				for (const key in newdata[i]) {
					newdata[i][key] = student[key];
				}
			}
		}
		newdata1 = {
			arr: newdata,
		};
		const jsonString = JSON.stringify(newdata1);
		console.log(jsonString);

		fs.writeFile('./db.json', jsonString, (err, data) => {
			if (err) return callback(err);
			callback(null);
		});
	});
};
