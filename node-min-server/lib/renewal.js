/*
* @des 热更新
* */
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('err', (err) => {
    console.log(`服务器异常：\n${err.stack}`);
    server.close()
})

server.on('message', (msg, rinfo) => {
    console.log(msg)
})

server.on('listening', () => {
    const address = server.address();
    console.log(`服务器监听${address.port}`)
})

server.bind(8000)





