(function () {
	/*
      静态属性，是类对象的属性
      非静态属性，是类的实例对象的属性
      static 无法使用实例对象进行方法  必须使用构造函数才可以访问
      总结：static 主要的目的 就是定义的属性无法通过new 关键字穿件的实力对象进行访问，必须通过构造函数才可以正常访问
  */
	class JinTai {
		name: string = '张三';
		static age: number = 123;
	}

	const jin = new JinTai();
	// console.log(jin);
	console.log(jin.name);
	// console.log(jin.age);
	console.log(JinTai.age);
})();
