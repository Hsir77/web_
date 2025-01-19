document.querySelector('nav').addEventListener('touchstart', function (e) {
	var start = e.targetTouches[0];
	console.log(start);
});
