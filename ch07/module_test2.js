/* user2.js 파일에서 exports 객체를 할당하였으므로, 
	require()를 호출할 때 자바스크립트에서 새로운 변수로 처리한다.
	결국 아무 속성도 없는 {}가 반환된다. */
var user = require('./user2');

console.dir(user);

function showUser(){
	return user.getUser().name + ','+user.group.name;
}

console.log(showUser);