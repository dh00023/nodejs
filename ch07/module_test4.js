//require()메소드는 함수를 반환
var user = require('./user4');

function showUser(){
	return user().name+','+'No group';
}
console.log(showUser());