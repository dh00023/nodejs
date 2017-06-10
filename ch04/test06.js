// 파일 시스템에 접근하기 위한 fs모듈
var fs=require('fs');

//파일을 비동기식 IO로 읽어 들인다.
var data = fs.readFile('./package.json','utf8',function(err,data){
	//읽어들인 데이터 출력
	console.log(data);	
});

console.log('프로젝트 폴더 안의 package.json 파일을 읽도록 요청');