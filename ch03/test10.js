var Users = [{name: "박우진", age: 19},{name: "옹성우",age:23},{name: "이우진",age: 16}];

console.log('사용자수 %d',Users.length);

for(var i = 0; i<Users.length;i++){
	console.log('배열요소 #'+i+': %s',Users[i].name);
}

delete Users[2];

Users.forEach(function(item,index){
	console.log('배열여소 #'+index+': %s',item.name);
});

