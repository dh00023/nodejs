var express = require('express') , http = require('http'), path = require('path');

//익스프레스 미들웨어 불러오기
var bodyParser = require('body-parser'),static = require('serve-static');

//익스프레스 객체 생성
var app = express();

// 기본 속성설정
app.set('port',process.env.PORT || 3000);

// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

//미들웨어 파라미터 확인
app.use(function(req,res,next){
	console.log('첫 번재 미들웨어에서 요청을 처리함');

	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;

	res.writeHead('200',{'Content-Type':'text/html;charset=utf-8'});
	res.write('<h1>Express 서버에서 응답한 값</h1>');
	res.write('<div><p>User-ID :'+paramId+'</p></div>');
	res.write('<div><p>param password :'+paramPassword+'</p></div>');
	res.end();
});

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작');
});