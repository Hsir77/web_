(function () {
	const MyPlugin = {};
	MyPlugin.install = function (Vue, options) {
		// 1. 添加全局方法或 property
		Vue.myGlobalMethod = function () {
			// 逻辑...
			alert('MyPlugin.myGlobalMethod 全局方法被调用了');
		};

		// 2. 添加全局资源
		Vue.directive('my-directive', {
			bind(el, binding, vnode, oldVnode) {
				// 逻辑...
				el.innerHTML = 'MyPlugin.my-directive指令被调用了' + binding.value;
			},
		});

		// 4. 添加实例方法
		Vue.prototype.$myMethod = function (methodOptions) {
			// 逻辑...
			alert('实例方法被调用了' + methodOptions);
		};
	};
	window.MyPlugin = MyPlugin;
})();
