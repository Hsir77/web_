(function () {
	//1. public（公共的）特性：
	// public 是默认的访问修饰符。如果在类的成员前没有显式地指定访问修饰符，那么该成员就是 public 的。
	// public 成员可以在类的内部、类的实例以及任何地方被访问。
	//2. private（私有的）特性：
	// 被 private 修饰的成员只能在声明它的类的内部访问，不能在类的外部或者派生类中访问。
	//3. protected（受保护的）特性：
	// protected 成员与 private 成员类似，它们都不能在类的外部被访问。但是，protected 成员可以在声明它的类的内部以及派生类（子类）中访问。
	class Person {
		protected name: string;
		constructor(name) {
			this.name = name;
		}
		say() {
			console.log(this.name, 'hello');
		}
	}

	class Student extends Person {
		private phone: number;
		age: number;
		constructor(name, phone, age) {
			super(name);
			this.phone = phone;
			this.age = age;
		}
		play() {
			console.log(this.phone, '打游戏', this.name);
		}
	}

	const p = new Person('张三');
	const s = new Student('张三', 18312345678, 18);
	// console.log(p.name);
	p.say();
	// console.log(s);
	s.play();
	// console.log(s.phone);
})();
