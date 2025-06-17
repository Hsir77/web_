const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
	if (req.url === '/') {
		fs.readFile('./02.html', (err, data) => {
			if (err) {
				return;
			}

			res.end(data);
		});
	} else if (req.url === '/02.css') {
		fs.readFile('./02.css', (err, data) => {
			if (err) {
				return;
			}

			res.end(data);
		});
	}
});

server.listen(8080, () => {
	console.log('start');
});
