// 'use strict'

// const { Worker, threadId } = require('worker_threads')

// console.log('メインスレッド', threadId)

// // CPUコアの数だけスレッド起動
// const cpuCount = require('os').cpus().length

// for (let i = 0; i < cpuCount; i++) {
//     // サブスレッドで実行するファイルパスを指定してworkerをnewする
//     const worker = new Worker(`${__dirname}/web-app.js`)
//     console.log('サブスレッド', worker.threadId)
// }