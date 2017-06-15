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

// 파일 업로드용 미들웨어
var multer = require('multer');

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

// mime 모듈
var mime = require('mime');



// 익스프레스 객체 생성
var app = express();

// 포트 설정
app.set('port', process.env.PORT || 3000);

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
 
// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

//클라이언트에서 ajax로 요청 시 CORS(다중 서버 접속) 지원
app.use(cors());


//multer 미들웨어 사용 : 미들웨어 사용 순서 중요  body-parser -> multer -> router
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'uploads')
    },
    filename: function (req, file, callback) {
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Date.now() + extension);
    }
});

var upload = multer({ 
    storage: storage,
    limits: {
		files: 10,
		fileSize: 1024 * 1024 * 1024
	}
});
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
	    createDate: {type: String,'default':''},
	    photo: {type: String, 'default': ''}
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
	MemoModel = mongoose.model("memo3", MemoSchema);
	console.log('memo 정의함.');
	
}


// 라우터 사용하여 라우팅 함수 등록
var router = express.Router();

// 메모 저장을 위한 라우팅 함수
router.route('/process/save').post(upload.array('photo', 1), function(req, res) {
	console.log('/process/save 호출됨.');
	
	var paramAuthor = req.body.author;
    var paramContents = req.body.contents;
	var paramCreateDate = req.body.createDate;

	var files = req.files;
	
        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')
        
		// 현재의 파일 정보를 저장할 변수 선언
		var filename = '',
			photo='';
		
		if (Array.isArray(files)) {   // 배열에 들어가 있는 경우 (설정에서 1개의 파일도 배열에 넣게 했음)
	        console.log("배열에 들어있는 파일 갯수 : %d", files.length);
	        
	        for (var index = 0; index < files.length; index++) {
	        	photo = files[index].path;
	        	filename = files[index].filename;
	        }

            console.log('현재 파일 정보 : '+ photo);

	    } else {
            console.log('업로드된 파일이 배열에 들어가 있지 않습니다.');
	    }
		
    
    // 데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
	if (database) {
		addMemo(database, paramAuthor, paramContents, paramCreateDate, photo, function(err, addedMemo) {
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
		        res.write('<div><p>메모가 저장되었습니다.</p></div>');
		        res.write('<img src="/' + photo + '" width="200px">');
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
var addMemo = function(database,  author, contents,createDate,photo, callback) {
	console.log('addMemo 호출됨 : ' +  author + ', ' + contents+createDate);
	
	// UserModel 인스턴스 생성
	var memo = new MemoModel({ "author":author, "contents":contents,"createDate":createDate,"photo":photo});

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


// 웹서버 시작
var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('웹 서버 시작됨 -> %s, %s', server.address().address, server.address().port);
  connectDB();
});


