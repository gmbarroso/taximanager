
var http = require('http');

var port = 9000;

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello there, world!\n');
}).listen(port);

console.log('Listening on port', port);

//
// var express = require('express');
// var app = express();
// var http = require('http');
// var bodyParser = require('body-parser');
//
// // app.set('view engine', 'ejs');
// // app.use(express.static('views'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//
//
// // Principal
// app.get('/', function(req, res) {
//
//   //res.sendfile('index.html')
//   res.end("alskdaksjdk")
// });
//
//
// app.listen(3001, function () {
//   console.log('Example app listening on port 3001!');
// });
