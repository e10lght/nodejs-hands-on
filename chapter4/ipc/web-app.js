'use strict'
const http = require('http');
const { fibonacci } = require('../fibonacci')
const pid = process.pid;

// IPCでメッセージを受信して指定されたポートでwebサーバ起動
process.on('message', p => {
    // メインプロセスから受け取った値
    const { port, msg } = p;
    console.log(pid, `ポート${port}で起動します`)
    console.log(msg)
    http.createServer((req, res) => {
        const n = Number((req.url.substring(1)))
        if (Number.isNaN(n)) {
            return res.end()
        }
        const response = fibonacci(n)
        // const word = 'nodejs!'  // サブプロセスからメインプロセスに単語を送信
        // IPCはプロセス間でのメッセージをデフォでJSONにシリアライズ(≒エンコード)する
        // シリアライズは"通信を行うための"変換処理みたいなイメージ？
        // 参考：https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/q14203103584
        // 送信したDate型は文字列としてメインプロセスに受け取られる
        const word = new Date(2019, 3, 20)

        // const word = JSON.stringify(date)
        // 結果をIPCで送信
        process.send({ pid, response, word })
        res.end(response.toString())
    }).listen(port)
})