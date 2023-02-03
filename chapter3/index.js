const http = require('http')
// サーバオブジェクト(EventEmitter)の生成
const server = http.createServer()
// EventEmitterに対する、requestイベントのリスナ登録
server.on('request', (req, res) => {
    res.writeHead(200, {'content-Type': 'text/plain'})
    res.write('Hello World')
    res.end()
})
// listening(リクエストの受付開始)イベントのリスな登録
server.on('listening', () => {
    console.log('受け付けました')
})
// errorイベントのリスな登録
server.on('error', err => {
    console.log(err)
})
// closeイベントのリスナ登録
server.on('close', ()=> {
    console.log('close')
})
// サーバの起動
server.listen(8000)