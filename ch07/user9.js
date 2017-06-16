// exports에 인스턴스 객체를 만들어 할당

// 생성자 함수
function User(id,name){
	this.id = id;
	this.name = name;
}

User.prototype.getUser = function(){
	return {id:this.id,name:this.name};
}

User.prototype.group = {id: 'group1',name:'친구'};

User.prototype.printUser = function(){
	console.log(this.name  + this.group.name);
}

exports.user = new User('test01','박우진');