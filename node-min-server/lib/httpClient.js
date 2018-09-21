/*
* http 代理
* */

const http = require('http');
const {URL} = require('url');

class httpClient {
    constructor(proxy) {
        var url = new URL(proxy);
        this.proxy = proxy;
        this.options = {
            host: url.hostname,
            port: url.port
        }
    }

    server(req, res) {

        switch (req.method) {
            case 'GET':
                this.get(req, res, 'GET')
            case 'POST':
                this.post(req, res, 'POST')
        }
    }

    // get
    get(req, res) {
        let options = Object.assign({}, this.options, {
            headers: req.headers,
            path: req.url
        })
        this.request(options,res)
    }

    // post
    post (req, res) {
        let options = Object.assign({}, this.options, {
            headers: req.headers,
            path: req.url
        })
        let postdata = '';
        req.on('data', (chunk) => {
            postdata +=chunk;
        })
        req.on('end', (chunk) => {
            postdata = parseBody(postdata)
            this.request(options, res, postdata)
        })
        options.method = 'POST';
    }
    request (options,res, data) {
        let request = http.request(options, (data) => {
            let body = '';
            res.writeHead(data.statusCode, data.headers);
            data.on('data', (chunk) => {
                body+=chunk;
            })
            data.on('end', () => {
                res.end(body)
            })
        })
        data && request.write(data)
        request.end()
    }

}


/*
* 获取请求中的cookie
* */
function parse(body) {
    var obj = {};
    for (let i = 0; i < body.length; i++) {
        obj[body[i]] = body[++i]
    }
    return obj;
}

/*
* 解析请求的body
* */
function parseBody(search) {
    let obj = {};
    search.split('&').forEach((v)=>{
        let arr = v.split('=');
        obj[arr[0]] =arr[1]
    });

    return JSON.stringify(obj)
}

module.exports = httpClient
