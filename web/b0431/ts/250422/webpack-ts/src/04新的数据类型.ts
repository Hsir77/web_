let und: null = undefined;

let null1: undefined = null;
console.log(und);
console.log(null1);

let str1: string = '你好';
str1 = undefined;
str1 = null;
console.log(str1);
let arr: [string, boolean, number] = ['666', true, 6];
console.log(arr);

enum sex {
	男,
	女,
}
console.log(sex[0]);
console.log(sex.女);

//any是任意类型可以给所有的数据类型
let any1: any = 10;
any1 = 'hello';
any1 = [1, 2, 3];
//如果数组中每个数据类型不一样可以用any
let arr1: any[] = [1, 2, true, 'hello'];

//void 用于声明函数时用但函数不能有返回值
function fn0(): void {
	return undefined;
	//但是可以返回undefined因为函数没有返回值时就是返回undefined
}

//object 不建议使用因为复杂数据类型的原型是object，无法进行约束
let obj1: object;
obj1 = [1, 2, 3];
obj1 = {};
obj1 = function fn2() {};

//不能用下面的方式约束函数中的参数
//下面的方式只能约束变量，不能约束参数，如果想约束参数则用接口的形式
let obj2: {
	name: string;
	age: number;
};
// function fn3(obj: obj2) {
// 	console.log(obj);
// }

//可以在参数之后加:来约束函数返回值的类型
function fn4(a: number): number {
	return a;
}
console.log(fn4(5));

//联合类型，一个参数中的变量可以有多种类型，自己定义
function fn5(a: number | string): string {
	return a.toString();
}

//类型推断 在声明变量时复制，声明的变量就是赋值的类型
let abc = 100;
// abc = 'abc';

//类型断言 就是告诉编译器，我知道自己是什么类型 不需要进行校验
//两种写法，一种str as string  第二种<string>str
function getstring2(str: string | number): number {
	if ((str as string).length) {
		return (str as string).length;
	} else {
		return str.toString().length;
	}
}
console.log(getstring2(100));
console.log(getstring2('100'));
