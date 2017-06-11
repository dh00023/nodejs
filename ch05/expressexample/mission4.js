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

//파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청했을 때 CORS(다중서버) 지원
var cors = require('cors');

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
app.use('/uploads',static(path.join(__dirname,'uploads')));

//cookie - parser 설정
app.use(cookieParser());

//session설정
app.use(expressSession({
	secret: 'my kye',
	resave: true,
	saveUninitialized: true
}));

//ajax 요청했을때 다중서버접속 지원
app.use(cors());

//multer미들웨어 사용 : 미둘웨어 사용 순서가 중요하다. body-parser->multer->router
//파일 제한 10개,1G
var storage = multer.diskStorage({
	destination: function(req,file,callback){
		callback(null,'uploads');
	},
	filename: function(req,file,callback){
		callback(null,file.originalname);
	}
});

var upload = multer({
	storage: storage,
	limits: {
		files: 10,
		filesize: 1024*1024*1024
	}
});

//라우터 사용해 라우팅 함수 등록
var router = express.Router();


router.route('/process/memo2').post(upload.array('photo',1),function(req,res){
	console.log('/process/memo2 처리함');

	try{
		var files = req.files;

		console.dir('#===== 업로드된 첫번째 파일 정보 =====#');
		console.dir(req.files[0]);
		console.dir('#================================#');

		//현재의 파일 정보를 저장할 변수 선언
		var originalname ='';

			//배열에 들어가 있는 경우(설정에서 1개의 파일도 배열에 넣음)
			if(Array.isArray(files)){
				console.log('배열에 들어있는 파일 수 : %d',files.length);

				for (var index = 0; index< files.length; index ++) {
					originalname=files[index].originalname;
				}
			}else{ // 배열에 들어가 있지않은 경우
				console.log('파일 갯수 : 1');
				originalname=files[index].originalname;
			}

			//클라이언트에 응답 전송

			res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
			res.write('<h1>나의 메모</h1>');
			res.write('<hr>');
			res.write('<h3>메모가 저장되었습니다.</h3>');
			res.write('<h3>서버에 저장된 사진</h3>');
			res.write('<img src="/uploads/'+originalname+'"');
			res.write("<br><br><a href = '/public/memo2.html'>다시 작성</a>");
			res.end();
		}catch(err){
			console.dir(err.stack);
		}
});

//라우터 객체를 app객체에 등록
app.use('/',router);

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작');
});