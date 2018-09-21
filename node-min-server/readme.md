# node-min-server
node-min-server 不依赖任何第三包的静态资源服务器，支持请求代理，单页面和多页面均可。
## Examples
```
var minServer = require('node-min-server')
const options = {
   // static: './static',
    static: {
       'css':['./static','../css','../../css/js'],
       'js':['./static'],
       'html':['../html'] // html 不在同一级可设置此参数
    },
    'resHeaderContent':{}, // 设置返回资源的conytent-type 非必传
    port: '3000',// 非必传
    proxy: {
        '/api': 'http:10.83.50.130:8080'  // 请求代理 旧：http:10.83.50.130:8080/getList 新 /api/getList
    },
    default: 'index.html', // 默认的首页
}
console.log(new minServer(options).server())
```
不需要设置代理是清掉proxy属性即可，资源路径可设置多个，端口号不设置默认2018，default默认路径为'/'是显示的页面。
###[https://github.com/jzyj-li/npm/tree/master/node-min-server](https://github.com/jzyj-li/npm/tree/master/node-min-server)

------