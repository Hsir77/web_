const http = require('http');
const server = http.createServer((req, res) => {
	res.setHeader('content-type', 'text/html;charset=utf-8');
	console.log(res.statusCode);
	console.log(res.statusMessage);
	res.end('404 NOT FROND');
});
server.listen(8080, () => {
	console.log('run...');
});
