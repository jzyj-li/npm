/*
* node-min-server
* @des http proxy、static server
* */

var http = require('http'),
    os = require('os'),
    fs = require('fs'),
    path = require('path'),
    ip = getLocalIp(os)[0].address,
    isExist = require('./file'),
    logError = require('./log'),
    httpClient = require('./httpClient');

var resHeaderContent = {
    'html': 'text/html;charset=UTF-8',
    'js': 'application/javascript',
    'css': 'text/css;charset=UTF-8',
    'png': 'image/png'
}

class minServer {
    constructor(options) {
        this.static = options.static; // 静态文件地址
        this.resHeaderContentType = Object.assign({}, options.resHeaderContent, resHeaderContent); // 响应文件的Content_type
        this.default = options.default || 'index.html'; // 默认打开的页面
        this.proxy = options.proxy;
        this.port = options.port || 2018;

        this.http =this.proxy?new httpClient(this.proxy['/api']):null;

    }

    server() {
        this.app = http.createServer((req, res) => {
            this.parseRequest(req, res);
        }).listen(this.port)

        console.log(`服务已启动：ip：${ip}, port：${this.port}`)
    }

    parseRequest(req, res) {
        let fileName = req.url;

        if (fileName == '/') {
            fileName = this.default
        }
        if (fileName.indexOf('favicon') > 0) {
            res.end();
            return
        }
        if (fileName.indexOf('?') > 0) { // 静态资源含有版本号的去除版本号
            fileName = fileName.substring(0, fileName.indexOf('?'))
        }
        if (!path.extname(fileName) && this.proxy) { // 代理请求
            !this.proxy['/api'] && logError('未配置代理地址');
            this.http.server(req, res);
            return
        }
        this.readFile(path.win32.basename(fileName), res)
    }

    readFile(file_name, res) {
        let filePath = this.renderFilePath(file_name);
        isExist(filePath, file_name).then(data => {
            this.creteReponse(res, file_name, data)
        }, reject => {
            let str = `file:${reject}不存在或未配置文件地址`
            fail(res, str);
            logError(str)
        })
    }

    renderFilePath (file_name) {
        let file_path = '', static_path = this.static;
        if (this.static){
           file_path =  typeof static_path == 'object'?(static_path[path.extname(file_name).substr(1)]?static_path[path.extname(file_name).substr(1)]:['./']): (file_name.indexOf('.html')>0?['./']:[this.static]);
        } else {
            file_path=['./'];
        }
        return file_path;
    }
    creteReponse(res, file_name, data) {
        let extname = path.extname(file_name).substr(1), header;

        header = this.resHeaderContentType[extname];
        header = header ? header : 'text/plain';
        res.writeHead(200, {'Content-Type': header});
        res.end(data)
    }

}

// 获取本机的ip
function getLocalIp(os) {
    var arr = os.networkInterfaces()['本地连接'];
    return arr.filter((v) => {
        if (v.family === 'IPv4' && v.address !== '127.0.0.1' && !v.internal) {
            return v;
        }
    })
}

// 404
function fail(res, str) {
    res.writeHead(404, {'Content-Type': 'text/plain;charset=UTF-8'})
    res.end(str)
}

module.exports = minServer




