var express = require('express') , http = require('http'), path = require('path');

//익스프레스 미들웨어 불러오기
var bodyParser = require('body-parser'),static = require('serve-static');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');
//익스프레스 객체 생성
var app = express();
// 기본 속성설정

app.set('port',process.env.PORT || 3000);


// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

//라우터 객체 참조
var router = express.Router();

//라우팅 함수 등록
router.route('/process/login').post(function(req,res){
	console.log('/process/login 처리함');

	var paramID = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;

	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>Express서버응답</h1>');
	res.write('<div><p>User-ID :'+paramID+'</p></div>');
	res.write('<div><p>param password :'+paramPassword+'</p></div>');
	res.write("<br><br><a href = '/login2.html'>로그인 페이지</a>");
	res.end();
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
	console.log('3000포트에서 시작');
});