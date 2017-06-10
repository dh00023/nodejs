var Users = [{name: "박우진", age: 19},{name: "옹성우",age:23},{name: "이우진",age: 16}];
Users.splice(1,0,{name: "강다니엘", age: 22});

console.log('배열 수 : %d',Users.length);

console.log('원래 배열');
console.dir(Users);

var Users2 = Users.slice(1,3);
console.log('잘라낸 배열');
console.dir(Users2);
