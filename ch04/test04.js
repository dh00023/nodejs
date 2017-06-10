var Calc = require('./calc');

var cal = new Calc();
// 인스턴스 객체의 emit() 메소드 호출해 stop이벤트 전
cal.emit('stop');

console.log(Calc.title+'에 stop 이벤트 전달');