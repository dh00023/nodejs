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

//데이터베이스 객체를 위한 변수 선언
var database;

//데이터 베이스 연결
function connectDB(){
	//DB 연결정보
	var databaseUrl = 'mongodb://localhost:27017/local';

	//DB연결
	MongoClient.connect(databaseUrl,function(err,db){
		if(err) throw err;

		console.log('데이터베이스에 연결되었습니다. : ',databaseUrl);

		//database변수 할당
		database = db;
	});
}

//사용자를 인증하는 함수
var authUser = function(database,id,password,callback){
	console.log('authUser호출');

	//users collection
	var users = database.collection('users');

	//id,password검색
	users.find({"id" : id, "password" : password}).toArray(function(err,docs){
		if(err){
			callback(err,null);
			return;
		}
		if(docs.length>0){
			console.log('id : %s, password : %s find',id,password);
			callback(null,docs);
		}else{
			console.log('일치하는 사용자 찾지못함.');
			callback(null,null);
		}
	});
}


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