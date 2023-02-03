'use strict'
const { fork, setupMaster } = require('cluster')

console.log('メインプロセス')

setupMaster({ exec: `${__dirname}/web-app` })

// CPUのコア数だけプロセスをフォーク
const cpuCount = require('os').cpus().length
for (let i = 0; i < cpuCount; i++) {
    const sub = fork()
    console.log('サブプロセス', sub.process.pid)
    const test = { port: 3003, msg: 'hi' }
    // IPCでサブプロセスにポート番号を送信
    sub.send(test)
    // IPCでサブプロセスにメッセージをハンドリング
    sub.on('message', ({ pid, response, word }) => {
        console.log(word, process.pid, `${pid}が${response}を返します`)
    })
}
