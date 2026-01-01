function ajax(url, method, params, callback) {
	method = method.toUpperCase();
	var str = [];
	for (const key in params) {
		//遍历对象在属性和值之间加+
		if (params[key]) {
			str.push(key + '=' + params[key]);
		}
	}
	var paramStr = str.join('&'); //拼接数组
	var qwer = new XMLHttpRequest();

	if (method == 'GET') {
		//如果是get方法在地址后加查找
		url += '?' + paramStr;
	}
	qwer.open(method, url);
	if (method == 'POST') {
		//如果是post加请求头
		qwer.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		qwer.send(paramStr);
	}
	qwer.send();
	qwer.onload = function () {
		callback(JSON.parse(qwer.responseText));
	};
}
