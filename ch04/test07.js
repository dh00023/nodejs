// 파일 시스템에 접근하기 위한 fs모듈
var fs=require('fs');

//파일에 데이터쓰기
var data = fs.writeFile('./output.txt','Hello World!',function(err){
	if(err){
		console.log('Errpr : '+err);	
	}
	console.log('output.txt에 데이터 쓰기완료');
});

