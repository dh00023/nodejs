var Pesron={};

Pesron.age = 23;
Pesron.name ='크롱';

var per =function(a,b){
	return a+b;
};

Pesron.add = per;

console.log('%d',Pesron.add(23,4));