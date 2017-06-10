var Users = [{name: "박우진", age: 19},{name: "옹성우",age:23}];

var add = function(a,b){
	return a+b;
};


Users.push(add);

console.log('사용자수 %d',Users.length);
console.log('세번째 함수 %d',Users[2](10,9));