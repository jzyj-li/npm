var minServer = require('../index')


const options = {
   // static: './static',
    static: {
       'css':['./static'],
       'js':['./static']
    },
    port: '3000',
    proxy: {
        '/api': 'http:10.83.50.130:8080'  // 请求代理 旧：http:10.83.50.130:8080/getList 新 /api/getList
    },
    default: 'index.html', // 默认的首页
}
console.log(new minServer(options).server())




