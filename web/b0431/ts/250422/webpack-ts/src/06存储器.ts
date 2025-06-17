(function () {
	class Student {
		private age: number;
		constructor(age) {
			this.age = age;
		}
		get age1() {
			return this.age;
		}
		set age1(value) {
			this.age = value;
		}
	}
	const xiaoming = new Student(18);
	xiaoming.age1 = 100;
	console.log(xiaoming.age1);
	console.log(xiaoming);

	//get为获取值时触发的方法(自动触发)
	//set为修改值时自动触发的方法
})();
