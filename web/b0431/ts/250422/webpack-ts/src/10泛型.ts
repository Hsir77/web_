(function () {
	// 泛型
	function getArr(value: number, count: number): number[] {
		const arr: number[] = [];
		for (let i = 0; i < count; i++) {
			arr.push(value);
		}
		return arr;
	}
	function getArr1(value: string, count: number): string[] {
		const arr: string[] = [];
		for (let i = 0; i < count; i++) {
			arr.push(value);
		}
		return arr;
	}
	console.log(getArr(100, 5));
	console.log(getArr1('a', 5));
	// [100, 100, 100, 100, 100]
	// 问题: 在写这个方法的时候 不确定里面传递的事字符串还是数字 只有在调用的时候才知道
	// 使用any可以解决这个问题，但是使用any类型 那么失去使用ts的意义了
	function getArr2(value: any, count: number): any[] {
		const arr: any[] = [];
		for (let i = 0; i < count; i++) {
			arr.push(value);
		}
		return arr;
	}
	console.log(getArr2(100, 5));
	console.log(getArr2('a', 5));
	//TS提供了一个泛型的写法
	// 在定义函数、接口、类的时候 不预先指定数据类型，而是在使用的时候再指定数据类型
	// 一般情况 泛型采用大写的英文字母 A-Z都可以
	// 相当于使用方法的时候插入一个占位符
	// 泛型使用<> T就是插入的占位符
	function getArr3<T>(value: T, count: number): T[] {
		const arr: T[] = [];
		for (let i = 0; i < count; i++) {
			arr.push(value);
		}
		return arr;
	}
	// 在调用的时候进行指定数据类型
	console.log(getArr3<string>('b', 5));
	console.log(getArr3<number>(200, 5));
	console.log(getArr3<boolean>(true, 5));
	// 使用多个泛型
	function fn1<SS, BA>(a, b) {
		return [a, b];
	}
	console.log(fn1<number, string>(1, 'a'));
})();
