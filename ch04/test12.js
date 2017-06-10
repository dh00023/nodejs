var fs = require('fs');

var inname =  './output.txt';
var outname = './output2.txt';

fs.exists(outname,function(exists){
	//파일을 만들기 전에 파일이 이미 존재하면 삭제한다.
	if(exists){
		fs.unlink(outname, function(err){
			if(err) throw err;
			console.log('기존 파일 ['+outname+']삭제함');
		});
	}
	var infile = fs.createReadStream(inname,{flags: 'r'});
	var outfile = fs.createWriteStream(outname,{flags: 'w'});
	//두개의 스트림을 pipe()메소드로 연결해 복사
	infile.pipe(outfile);
	console.log('파일 복사'+inname +outname);
});