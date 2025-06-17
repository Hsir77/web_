(function () {
    class Person {
        constructor(firstName, lastName) {
            this.firstName = firstName;
            this.lastName = lastName;
            this.allName = firstName + lastName;
        }
    }
    function show(person) {
        return person.firstName + person.lastName;
    }
    const p = new Person('12', '34');
    console.log(show(p));
    console.log(p);
})();
