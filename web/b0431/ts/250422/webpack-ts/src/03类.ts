(function () {
	// 类：可以理解为一个末班 然后通过这个模版进行实例化对象
	class Person {
		// 定义公共参数
		name: string;
		age: number;
		sex: string;
		// 构造函数
		// constructor(name, age, sex) {
		//     this.name = name;
		//     this.age = age;
		//     this.sex = sex;
		// }
		// 构造函数 默认初始值
		constructor(name = '李四', age = 20, sex = '女') {
			this.name = name;
			this.age = age;
			this.sex = sex;
		}
		say(str: string) {
			console.log(` 打搅好，我是${this.name},今年${this.age}岁`, str);
		}
	}
	const person = new Person('张三', 18, '男');
	const person1 = new Person(); // 如果穿件实例的时候 没有传递参数 会执行默认值
	// person.say('我会飞');
	console.log(person);
	console.log(person1);

	// 类继承
	// A类继承B类 那么 A类叫做子类 B类叫做父类
	// 子类--派生类
	// 父类 -- 基类 --- 超类
	// 定义一个父类
	class Person1 {
		// 定义公共参数
		name: string;
		age: number;
		sex: string;
		// 构造函数
		// constructor(name, age, sex) {
		//     this.name = name;
		//     this.age = age;
		//     this.sex = sex;
		// }
		// 构造函数 默认初始值
		constructor(name = '李四', age = 20, sex = '女') {
			this.name = name;
			this.age = age;
			this.sex = sex;
		}
		say(str: string) {
			console.log(` 打搅好，我是${this.name},今年${this.age}岁`, str);
		}
	}

	// 子类
	class Person2 extends Person1 {
		phone: number;
		constructor(name, age, sex, phone) {
			// 注意点：如果引用父类的属性 super必须在最上面
			super(name, age, sex);
			this.phone = phone;
		}
	}
	const person22 = new Person2('王五', 18, '男', 18312345678);
	console.log(person22.say('aaaa'));
	console.log(person22);

	// 注意点：再TS中 使用类进行构造函数 必须在类中添加公共属性 或者使用接口进行约束 在接口用定义公共属性
})();
