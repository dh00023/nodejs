var path = require('path');

// directory name join

var directories = ["users","mike","docs"];
var docsDirectory = directories.join(path.sep);
console.log('문서 디렉터리 : %s',docsDirectory);

//directory name joins file name

var curPath = path.join('/Users/mike','notepad.exe');
console.log('file path : %s',curPath);

// directory, file, ext name

var filename = "/Users/dh0023/Web/Study/Doit/nodejs/ch02/test7.js";
var dirname = path.dirname(filename);
var basename = path.basename(filename);
var extname = path.extname(filename);

console.log("%s, %s, %s",dirname, basename, extname);