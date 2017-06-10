// 파일 시스템에 접근하기 위한 fs모듈
var fs=require('fs');

// 파일 열기
fs.open('./output.txt','r',function(err,fd){
	
	//데이터는 필요한 만큼 Buffer객체 안에 쓴다.
	var buf = new Buffer(10);
	console.log('버퍼타입 : %s',Buffer.isBuffer(buf));

	fs.read(fd,buf,0,buf.length,null,function(err,bytesRead,buffer){
		if(err) throw err;

		var inStr = buffer.toString('utf8',0,bytesRead);
		console.log('파일에서 읽은 데이터 : %s',inStr);

		console.log(err,bytesRead,buffer);

		//파일닫기
		fs.close(fd,function(){
			console.log('파일 열고 데이터 읽기 완료');
		})
	})
})