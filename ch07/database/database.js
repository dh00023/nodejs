var mongoose = require('mongoose');

//database객체에 db,schema, model 모두 추가
var database = {};
database.init = function(app,config){
	console.log('init()호출됨');

	connect(app,config);
}

//데이터베이스에 연결하고 응답 객체의 속성으로 db객체 추가
function connect(app,config){
	console.log('connect()호출됨');

	//데이터베이스 연결 :config설정 사용
	mongoose.Promise = global.Promise;
	mongoose.connect(config.db_url);
	database.db = mongoose.connection;

	database.db.on('error',console.error.bind(console,'mongoose connection error'));
	database.db.on('open',function(){
		console.log('데이터베이스에 연결되었습니다 : '+config.db_url);
		createSchema(app,config);
	});
	database.db.on('disconnected',connect);
}

//config에 정의한 스키마 및 모델 객체 생성
function createSchema(app,config){
	var schemaLen = config.db_schemas.length;
	console.log('설정에 정의된 스키마 수 %d',schemaLen);

	for(var i = 0;i<schemaLen;i++){
		var curItem = config.db_schemas[i];

		//모듈 파일에서 모듈 불러온 후 createSchema 함수 호출
		var curSchema = require(curItem.file).createSchema(mongoose);
		console.log('%s모듈 불러들인 후 스키마 정의',curItem.file);

		//User모델 정의
		var curModel = mongoose.model(curItem.collection,curSchema);
		console.log('%s컬렉션 위해 모델 정의',curItem.collection);

		//database객체에 속성추가
		database[curItem.schemaName]=curSchema;
		database[curItem.modelName]=curModel;
		console.log('스키마 이름 %s 모델 이름 %s',curItem.schemaName,curItem.modelName);
	}
	app.set('database',database);
	console.log('database 객체가 app객체의 속성으로 추가');
}

//module.exports할당
module.exports = database;