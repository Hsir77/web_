// 鼠标划入图片显示左右按钮
// 鼠标划出图片隐藏左右按钮
var a = document.querySelectorAll('.fbox a');
var fbox = document.querySelector('.fbox');
var buttoma = document.querySelector('.buttoma');
var topa = document.querySelector('.topa');
var li = document.querySelectorAll('li');
fbox.onmouseover = function () {
	for (var i = 0; i < a.length; i++) {
		a[i].style.display = 'block';
	}
	clearInterval(auto);
};

fbox.onmouseout = function () {
	for (var i = 0; i < a.length; i++) {
		a[i].style.display = 'none';
	}
	auto = setInterval(function () {
		buttoma.onclick();
	}, 1500);
};
var fboxWidth = fbox.offsetWidth;
var mbox = document.querySelector('.mbox');
var tu = document.querySelectorAll('.tu');
var num = 0;
buttoma.onclick = function () {
	num++;
	li[num].id = 'red';
	var siblist = getSib(li[num]);
	for (var k = 0; k < siblist.length; k++) {
		siblist[k].id = '';
	}
	if (num == tu.length) {
		mbox.style.left = 0;
		num = 0;
	}
	animate(mbox, -num * fboxWidth);
	return false;
};
topa.onclick = function () {
	if (num == 0) {
		mbox.style.left = -num * fboxWidth + 'px';
		num = tu.length;
	}
	num--;
	li[num].id = 'red';
	var siblist = getSib(li[num]);
	for (var k = 0; k < siblist.length; k++) {
		siblist[k].id = '';
	}
	animate(mbox, -num * fboxWidth);
	return false;
};

for (var j = 0; j < li.length; j++) {
	li[j].index = j;
	li[j].onclick = function () {
		this.id = 'red';
		var siblist = getSib(this);
		for (var k = 0; k < siblist.length; k++) {
			siblist[k].id = '';
		}
		mbox.style.left = -this.index * fboxWidth + 'px';
	};
}
auto = setInterval(function () {
	buttoma.onclick();
}, 1500);
