function Person(name, age){
	this.name = name;
	this.age = age;
}

Person.prototype.walk = function(speed){
	console.log(speed + 'km로 걸어간다.');
}

var person0 = new Person('박우진',19);
var person1 = new Person('옹성우',23);

console.log(person0.name);
person0.walk(10);