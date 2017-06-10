var util = require('util');
// events모듈을 불러들인 후 EventEmitter객체참조
var EventEmitter = require('events').EventEmitter;

var Calc = function(){
	//프로토타입 객체로 this를 사용해 자기자신을 가리킴.
	// 그 객체안에 정의된 속성에 접근
	var self = this;

	this.on('stop',function(){
		console.log('Calc에 stop 이벤트 전달');
	});
};

// 상속은 util모듈의 inherits()메소드를 이용해서 정의
util.inherits(Calc,EventEmitter);

// new연산자를 이용해 Calc를 만들었을때 add()함수 사용할 수 있음.
Calc.prototype.add = function(a,b){
	return a+b;
}

// Calc객체 참조할 수 있도록 지
module.exports = Calc;
module.exports.title = 'calculator';