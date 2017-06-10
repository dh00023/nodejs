var Users = [{name: "박우진", age: 19},{name: "옹성우",age:23},{name: "이우진",age: 16}];

Users.splice(1,0,{name: "강다니엘", age: 22});

console.dir(Users);

Users.splice(2,1);
console.dir(Users);
