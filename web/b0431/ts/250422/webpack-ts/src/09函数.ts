(function () {
	function add(x: number, y: number): number {
		return x + y;
	}
	console.log(add(1, 2));

	function add1(x: number, y: number, c?: number): number {
		return x + y;
	}
	console.log(add1(1, 2));

	// 剩余参数 会自动生成一个数组
	function msg(str: string, ...strN: string[]) {
		console.log(str);
		console.log(strN);
	}
	msg('a', 'b', 'c', 'd', 'e', 'f');

	// 函数重载: 函数名相同，而形参不同的多个函数
	// 在JS中，由于弱类型的特点和形参与实参可以不匹配，是没有函数重载这一说的
	// 但在TS中，与其它面向对象的语言(如Java)就存在此语法

	// function add2(x: string | number, y: string | number): string | number {
	//     // return x + y;
	//     if (typeof x =='string' && y =='string') {
	//         return x + y;
	//     } else if (typeof x == 'number' && y == 'number') {
	//         return x + y;
	//     }
	// }
	// ts提供函数重载
	function add2(x: string, y: string): string;
	function add2(x: number, y: number): number;

	function add2(x, y) {
		if (typeof x == 'string' && y == 'string') {
			return x + y;
		} else if (typeof x == 'number' && y == 'number') {
			return x + y;
		}
	}
})();
