// Express 기본 모듈 불러오기
var express = require('express');
var http = require('http');
var path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser');
var static = require('serve-static');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// mongoose 모듈 사용
var mongoose = require('mongoose');

// 파일 처리
var fs = require('fs');


// 익스프레스 객체 생성
var app = express();

// 포트 설정
app.set('port', process.env.PORT || 3000);

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
// 데이터베이스 객체를 위한 변수 선언
var database;

// 데이터베이스 스키마 객체를 위한 변수 선언
var MemoSchema;

// 데이터베이스 모델 객체를 위한 변수 선언
var MemoModel;

//데이터베이스에 연결
function connectDB() {
	// 데이터베이스 연결 정보
	var databaseUrl = 'mongodb://localhost:27017/local';
	 
	// 데이터베이스 연결
    console.log('데이터베이스 연결을 시도합니다.');
    mongoose.Promise = global.Promise;  // mongoose의 Promise 객체는 global의 Promise 객체 사용하도록 함
	mongoose.connect(databaseUrl);
	database = mongoose.connection;
	
	database.on('error', console.error.bind(console, 'mongoose connection error.'));	
	database.on('open', function () {
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		
        
		// user 스키마 및 모델 객체 생성
		createMemoSchema();
		
		
	});
	
    // 연결 끊어졌을 때 5초 후 재연결
	database.on('disconnected', function() {
        console.log('연결이 끊어졌습니다. 5초 후 재연결합니다.');
        setInterval(connectDB, 5000);
    });
}

// user 스키마 및 모델 객체 생성
function createMemoSchema() {

	// 스키마 정의
	// password를 hashed_password로 변경, 각 칼럼에 default 속성 모두 추가, salt 속성 추가
	MemoSchema = mongoose.Schema({
	    author: {type: String, 'default':''},
	    contents: {type: String, 'default':''},
	    createDate: {type: String,'default':''}
	});
	
	
	
	// 값이 유효한지 확인하는 함수 정의
	var validatePresenceOf = function(value) {
		return value && value.length;
	};
		
		
	// 필수 속성에 대한 유효성 확인 (길이값 체크)
	MemoSchema.path('author').validate(function (author) {
		return author.length;
	}, 'author 칼럼의 값이 없습니다.');
	
	MemoSchema.path('contents').validate(function (contents) {
		return contents.length;
	}, 'contents 칼럼의 값이 없습니다.');
	
	   
	// 스키마에 static으로 findById 메소드 추가
	MemoSchema.static('findById', function(id, callback) {
		return this.find({id:id}, callback);
	});
	
    // 스키마에 static으로 findAll 메소드 추가
	MemoSchema.static('findAll', function(callback) {
		return this.find({}, callback);
	});
	
	console.log('MemoSchema 정의함.');
	
	// memo 모델 정의
	MemoModel = mongoose.model("memo2", MemoSchema);
	console.log('memo 정의함.');
	
}


// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

// 메모 저장을 위한 라우팅 함수
router.route('/process/save').post(function(req, res) {
	console.log('/process/save 호출됨.');
	
	var paramAuthor = req.body.author;
    var paramContents = req.body.contents;
	var paramCreateDate = req.body.createDate;
		
	console.log('작성자 : ' + paramAuthor);
	console.log('내용 : ' + paramContents);
	console.log('일시 : ' + paramCreateDate);

    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (database) {
		addMemo(database, paramAuthor, paramContents, paramCreateDate, function(err, addedMemo) {
            // 동일한 id로 추가하려는 경우 에러 발생 - 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 추가 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 결과 객체 있으면 성공 응답 전송
			if (addedMemo) {
				console.dir(addedMemo);
 
				res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
		        res.write('<h3>나의 메모</h3><hr>');
		        res.write('<div><p>메모가 저장되었습니다.</p></div>');
		        res.write('<div><input type="button" value="다시 작성" onclick="javascript:history.back()"></div>');
		        res.end();
			} else {  // 결과 객체가 없으면 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>메모 추가  실패</h2>');
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
	
		
});

//사용자를 추가하는 함수
var addMemo = function(database,  author, contents,createDate, callback) {
	console.log('addMemo 호출됨 : ' +  author + ', ' + contents+createDate);
	
	// UserModel 인스턴스 생성
	var memo = new MemoModel({ "author":author, "contents":contents,"createDate":createDate});

	// save()로 저장 : 저장 성공 시 addedUser 객체가 파라미터로 전달됨
	memo.save(function(err, addedMemo) {
		if (err) {
			callback(err, null);
			return;
		}
		
	    console.log("사용자 데이터 추가함.");
	    callback(null, addedMemo);
	     
	});
}

app.use('/', router);


// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
    static: {
      '404': './public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


// 웹서버 시작// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  // 데이터베이스 연결을 위한 함수 호출
  connectDB();
   
});
