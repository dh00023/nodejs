// 파일 시스템에 접근하기 위한 fs모듈
var fs=require('fs');

//파일을 동기식 IO로 읽어 들인다.
var data = fs.readFileSync('./package.json','utf8');

//읽어들인 데이터 출력
console.log(data);