interface Person {
	readonly name: string; //readonly只读属性 在类中不能修改
	age: number;
	sex: string;
	id: number;
	hobby?: string[]; //代表约束中的项可以选填
	[key: string]: any; //代表使用约束的变量可以自己添加某一项，比如约束4项填5项
}
const person: Person = {
	name: '666',
	age: 18,
	sex: 'nan',
	id: 123456789,
	city: 'harbin',
};

/*********************************************** */
//接口约束函数

const fn1 = function (str: string, str1: string): boolean {
	//字符串查询API
	return str.search(str1) > -1;
};
console.log(fn1('abcdefhg', 'cde'));
//利用约束来省略形参类型和返回值类型
interface IFunction {
	(str: string, str1: string): boolean;
}
function fn2<IFunction>(str, str1) {
	return true;
}

/*************************************************** */
//接口约束类
// 定义一个接口 约束 类中必须要有固定的函数

interface IJS {
	js(): any;
}

// 通过类 进行使用接口约束
// implements 用接口约束 类的关键字
class Persons implements IJS {
	js() {
		console.log('我会JS');
	}
}
const per = new Persons();
per.js();

interface IHtml {
	html(): any;
}

class Persons1 implements IHtml {
	html() {
		console.log('html');
	}
}

// 定义一个类 同时使用两个接口进行约束
// 一个类可以调用多个接口进行约束，使用逗号进行分割
class Persons2 implements IJS, IHtml {
	js() {
		console.log('我会JS');
	}
	html() {
		console.log('我会HTML');
	}
}
const per1 = new Persons2();
per1.js();
per1.html();

interface IWeb extends IJS, IHtml {
	css(): any;
}

class Persons3 implements IWeb {
	js() {
		console.log('我会JS');
	}
	html() {
		console.log('我会HTML');
	}
	css() {
		console.log('我会css');
	}
}
const per2 = new Persons3();
per2.js();
per2.html();
per2.css();
