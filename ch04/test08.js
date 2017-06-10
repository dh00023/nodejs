// 파일 시스템에 접근하기 위한 fs모듈
var fs=require('fs');

// 파일 열기
fs.open('./output.txt','w',function(err,fd){
	
	//데이터는 필요한 만큼 Buffer객체 안에 슨다.
	var buf = new Buffer('안녕\n');
	fs.write(fd,buf,0,buf.length,null,function(err,written,buffer){
		if(err) throw err;
		console.log(err,written,buffer);

		//파일닫기
		fs.close(fd,function(){
			console.log('파일 열고 데이터 쓰고 파일 닫기');
		})
	})
})