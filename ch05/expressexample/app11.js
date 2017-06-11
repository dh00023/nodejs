var express = require('express') , http = require('http'), path = require('path');

//익스프레스 미들웨어 불러오기
var bodyParser = require('body-parser'),static = require('serve-static');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var cookieParser = require('cookie-parser');

//익스프레스 객체 생성
var app = express();
// 기본 속성설정
app.set('port',process.env.PORT || 3000);

app.use(cookieParser());
// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

//라우터 객체 참조
var router = express.Router();

//라우팅 함수 등록
router.route('/process/showCookie').get(function(req,res){
	console.log('/process/showCookie 처리함');

	res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function(req,res){
	console.log('/process/setUserCookie 처리함');

	res.cookie('user',{
		id: 'dahye',
		name: '정다혜',
		authorized: true
	});

	res.redirect('/process/showCookie');
});

//라우터 객체를 app객체에 등록
app.use('/',router);

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작');
});