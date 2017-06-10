var http = require('http');

//웹 서버 객체 생성
var server = http.createServer();

/*웹 서버를 시작해 3000번 포트에서 대기
var port = 3000;
server.listen(port,function(){
	console.log('웹 서버가 시작되었다. %s',port);
});
*/

// 웹 서버를 시작해 127.0.0.1 IP와 3000번 포트에서 대기
var host = '127.0.0.1';
var port = 3000;
server.listen(port,host,'50000',function(){
	console.log('웹 서버가 시작되었다. %s %d',host,port);
});
