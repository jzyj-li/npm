var app = require('http').createServer(function (req, res) {
    console.log(req.url)
    res.writeHead(200)
    res.end('123')
}).listen(8080)