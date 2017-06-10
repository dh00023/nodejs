var calc={};

calc.add = function(a,b){
	return a+b;
};

console.log('모듈로 분리하기 전 호출 결과 : %d',calc.add(10,10));