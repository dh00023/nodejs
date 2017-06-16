//module.exports에는 객체를 그대로 할당할 수 있다.
var user = {
	getUser : function(){
		return {id: 'test01',name: '박우진'};
	},
	group : {id: 'group1',name:'친구'}
}

module.exports = user;