'use strict'
const { parentPort, workerData } = require('worker_threads')

parentPort.postMessage(
    workerData.buffer,
    // postMessage()の第二引数に転送対象オブジェクトを指定
    workerData.transfer ? [workerData.buffer] : []
)


/** REPL **/
// Entering editor mode (^D to finish, ^C to cancel)
// function useMaybeTransfer(transfer) {
//     // 1 GBのArrayBufferを生成 
//     const buffer = new ArrayBuffer(1024 * 1024 * 1024)
//     // 現在時刻を記録 
//     const start = perf_hooks.performance.now()
//     new worker_threads.Worker(
//         './maybe-transfer.js',
//         {
//             workerData: { buffer, transfer },
//             // transferListプロパティに転送対象オブジェクトを指定 
//             transferList: transfer ? [buffer] : []
//         }
//     ).on('message', () =>
//         // サブスレッドから値が戻ってくるまでにかかった時間を出力 
//         console.log(perf_hooks.performance.now() - start)
//     )
//     // サブスレッドに渡した値がどう見えるか確認 
//     console.log(buffer)
// } 