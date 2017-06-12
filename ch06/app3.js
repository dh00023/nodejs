//Express 기본 모듈
var express = require('express') 
	, http = require('http')
	, path = require('path');

//익스프레스 미들웨어 불러오기
var bodyParser = require('body-parser')
	,cookieParser = require('cookie-parser')
	,static = require('serve-static')
	,errorHandler=require('errorhandler');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어
var expressSession = require('express-session');

//익스프레스 객체 생성
var app = express();

// 기본 속성설정
app.set('port',process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

//public,uploads 폴더 오픈
app.use('/public',static(path.join(__dirname,'public')));

//cookie - parser 설정
app.use(cookieParser());

//session설정
app.use(expressSession({
	secret: 'my kye',
	resave: true,
	saveUninitialized: true
}));

//몽고디비 모듈 사용
var MongoClient = require('mongodb').MongoClient;

//몽구스 모듈 불러들이기
var mongoose = require('mongoose');

//데이터베이스 객체를 위한 변수 선언
var database;

//데이터베이스 스키마 객체를 위한 변수 선언
var UserSchema;

//데이터베이스 모델 객체를 위한 변수 선언
var UserModel;

//데이터 베이스 연결
function connectDB(){
	//DB 연결정보
	var databaseUrl = 'mongodb://localhost:27017/local';

	console.log('데이터베이스 연결을 시도합니다.');
	mongoose.Promise = global.Promise;
	mongoose.connect(databaseUrl);
	database = mongoose.connection;

	database.on('error',console.error.bind(console,'mongoose connection error'));
	database.on('open',function(){
		console.log('데이터베이스에 연결되었습니다.'+databaseUrl);

		//스키마정의
		UserSchema = mongoose.Schema({
			id: String,
			name: String,
			password: String
		});
		console.log('schema정의');

		//모델 정의
		UserModel = mongoose.model("users",UserSchema);
		console.log('모델정의');
	});

	//연결끊어지면 5초후 재연결
	database.on('disconnected',function(){
		console.log('연결이 끊어짐. 재연결');
		setInterval(connectDB,5000);
	});
}

//사용자를 인증하는 함수
var authUser = function(database,id,password,callback){
	console.log('authUser호출');

	
	//id,password검색
	UserModel.find({"id" : id, "password" : password},function(err,results){
		if(err){
			callback(err,null);
			return;
		}
		console.log('id : %s, password : %s find',id,password);
		console.dir(results);
		if(docs.length>0){
			console.log('id : %s, password : %s find',id,password);
			callback(null,results);
		}else{
			console.log('일치하는 사용자 찾지못함.');
			callback(null,null);
		}
	});
};

//사용자를 추가하는 함수
var addUser = function(database,id,password,name,callback){
	console.log('addUser호출' +id+password+name);

	//users collection
	var user = new UserModel({"id":id,"password":password,"name":name});

	//save로저장
	user.save(function(err){
		if(err){
			callback(err,null);
			return;
		}
		console.log('사용자 데이터 추가함');
		callback(null,user);
	});
};

//라우터 사용해 라우팅 함수 등록
var router = express.Router();

//로그인 라우팅 함수-DB정보와 비교
app.post('/process/login',function(req,res){
	console.log('/process/login 호출');
	
	var paramId = req.param('id');
	var paramPassword = req.param('password');

	if(database){
		authUser(database,paramId,paramPassword,function(err,docs){
			if(err) {throw err;}

			if(docs){
				console.dir(docs);

				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인성공</h1>');
				res.write('<div><p>User-ID :'+paramId+'</p></div>');
				res.write("<br><br><a href = '/public/login.html'>다시로그인하기</a>");
				res.end();
			}else{
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 실패</h1>');
				res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오</p></div>');
				res.write("<br><br><a href = 'public/login.html'>로그인 페이지</a>");
				res.end();
			}
		});
	}else{
	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>DB연결 실패</h1>');
	res.end();
	}
});

//사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req,res){
	console.log('/process/adduser 호출');
	
	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;
	var paramName = req.body.name || req.query.name;

	console.log('요청 파라미터'+paramId+paramPassword+paramName);

	if(database){
		addUser(database,paramId,paramPassword,paramName,function(err,result){
			if(err) {throw err;}

			if(result&&result.insertedCount>0){
				console.dir(result);

				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 추가 성공</h1>');
				res.end();
			}else{
				res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>사용자 추가 실패</h1>');
				res.end();
			}
		});
	}else{
	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>DB연결 실패</h1>');
	res.end();
	}
});

//라우터 객체를 app객체에 등록
app.use('/',router);

var errorHandler=expressErrorHandler({
	static: {
		'404': './public/404.html'
	}
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작'+app.get('port'));

	connectDB();
});