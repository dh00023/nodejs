var express = require('express') , http = require('http'), path = require('path');

//익스프레스 미들웨어 불러오기
var bodyParser = require('body-parser'),static = require('serve-static');

//오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

//익스프레스 객체 생성
var app = express();
// 기본 속성설정
app.set('port',process.env.PORT || 3000);

app.use(cookieParser());
app.use(expressSession({
	secret: 'my kye',
	resave: true,
	saveUninitialized: true
}));
// body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended: false}));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(static(path.join(__dirname,'public')));

//라우터 객체 참조
var router = express.Router();

//라우팅 함수 등록
router.route('/process/product').get(function(req,res){
	console.log('/process/product 처리함');

	if(req.session.user){
		res.redirect('/product.html');
	}else{
		res.redirect('/login2.html');
	}
});
router.route('/process/login').post(function(req,res){
	console.log('/process/login 처리함');

	var paramId = req.body.id || req.query.id;
	var paramPassword = req.body.password || req.query.password;

	if(req.session.user){
		console.log('이미 로그인되어 상품 페이지로 이동');

		res.redirect('/product.html');
	}else{
		//세션저장
		req.session.user = {
			id: paramId,
			name: '박우진',
			authorized: true
		};

	res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>로그인 성공</h1>');
	res.write('<div><p>User-ID :'+paramId+'</p></div>');
	res.write('<div><p>param password :'+paramPassword+'</p></div>');
	res.write("<br><br><a href = '/process/product'>상품페이지 페이지</a>");
	res.end();

	}
});


router.route('/process/logout').get(function(req,res){
	console.log('/process/logout 처리함');

	if(req.session.user){
		console.log('로그아웃합니다.');

		req.session.destroy(function(err){
			if(err) {throw err;}

			console.log('세션을 삭제하고 로그아웃함.');
			res.redirect('/login2.html');
		});
	}else{
		
		console.log('아직 로그인 안되어ㅣㅆ습니다.');
		res.redirect('/login2.html');
	}
});

//라우터 객체를 app객체에 등록
app.use('/',router);

http.createServer(app).listen(3000,function(){
	console.log('3000포트에서 시작');
});