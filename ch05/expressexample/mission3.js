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
router.route('/process/memo').post(function(req,res){
	console.log('/process/memo 처리함');

	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>나의메모</h1>');
	res.write('<hr>');
	res.write('<div>메모가 저장되었습니다.</div>');
	res.write("<br><br><a href = '/memo.html'>다시 작성</a>");
	res.end();
});

//라우터 객체를 app객체에 등록
app.use('/',router);
app.all('*',function(req,res){
	res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작');
});