(function () {
	/*
      抽象类  abstract
      不能创建实例对象，只有实现类才能创建实例
      可以包含未实现的抽象方法
  */
	abstract class Animal {
		name: string;
		constructor(name) {
			this.name = name;
		}
		say() {
			console.log('汪汪');
		}
	}
	class Dog extends Animal {
		constructor(name) {
			super(name);
		}
	}

	const d = new Dog('小白');
	console.log(d);
	d.say();
	// console.log(a);
})();
