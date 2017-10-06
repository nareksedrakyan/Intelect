var http = require('http');
var url = require('url');
var server = new http.Server(function(req,res){
    console.log(req.headers);
    // res.end('<html><body><h1>Hello, World hhh!!!</h1></body></html>');
    console.log(req.method,req.url);
    var urlParsed = url.parse(req.url,true);
    console.log(urlParsed);
    if (urlParsed.pathname == '/echo' && urlParsed.query.message) {
        res.setHeader('Cache-control','no-cache');
        res.statusCode = 200;
        res.end(urlParsed.query.message);
    } else {
        res.statusCode = 404;
        res.end('Page not found');
    }
});



server.listen(8080,'127.0.0.1');

