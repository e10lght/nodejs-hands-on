'use strict'

const http = require('http')
const { fibonacci } = require('./fibonacci')

// サーバオブジェクトの生成とリクエストハンドラの設定
http.createServer((req, res) => {
    // http://localhost:3000/10へのリクエストではreq.urlは'/10'になるので、
    // そこから１文字取り除いてnを取得する
    const n = Number(req.url.substring(1))
    if (Number.isNaN(n)) {
        // 数値かどうかを判定し、そうでなければ無視
        return res.end()
    }
    const result = fibonacci(n)
    res.end(result.toString())
}).listen(3003)