(function () {
	interface Person {
		firstName: string;
		lastName: string;
		allName: string;
	}
	class Person {
		constructor(firstName, lastName) {
			this.firstName = firstName;
			this.lastName = lastName;
			this.allName = firstName + lastName;
		}
	}
	function show(person: Person) {
		return person.firstName + person.lastName;
	}
	const p = new Person('12', '34');
	console.log(show(p));
	console.log(p);
})();
