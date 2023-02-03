const fs = require('node:fs');
const events = require('events');
const { resolve } = require('node:path');
const { rejects } = require('node:assert');

// EbentEmitterインスタンスの生成
const event = new events.EventEmitter()
// // リスナを登録する
// const asyncIterable = events.on(event, 'eventA')
// // リスナが登録されることを確認
// event.listeners('eventA')

// // for await ofループでerrorイベントを処理している？
// // (async () => {
// //     for await (const a of asyncIterable) {
// //         // 何もしない
// //     }
// // })().catch(err => console.error('for await ofでエラー', err))

// event.on('error', (err) => {
//     console.log(err.message)
// })

// // errorイベントを発火させ、スローをerrorイベントにわたす
// // event.emit('error', new Error('エラー'))

// // リスナの登録が解除されることを確認
// // これ以上リスナがイベント発火で呼び出されることはない
// event.listeners('eventA')

// リスナを登録する
// const asyncIterable2 = (async function* () {
//     while (true) {
//         const data = await new Promise((resolve) => {
//             event.on('eventA', resolve)
//         })
//         yield data
//     }
// })()

// // EventEmitterインスタンスに対してerrorイベントを発行
// event.emit('error', new Error('エラーが発生しました'))

//     // for await ofループでerrorイベントを処理
//     (async () => {
//         for await (const data of asyncIterable2) {
//             console.log(data)
//         }
//     })().catch((err) => console.error('for await ofでエラー', err))
// event.listeners('eventA')


const ee = new events.EventEmitter()
// asyncイテラブルを返す
const promise = events.on(ee, 'eventB')
console.log(promise)
promise.catch(err => console.log(err.message))
ee.emit('error', new Error('えらー'))

const onceEventEmitter = new events.EventEmitter()
// Promiseを返す
const oncePromise = events.once(onceEventEmitter, 'eventB')
console.log(oncePromise)
oncePromise.catch(err => console.error('Promiseインスタンスの拒否', err.message))
onceEventEmitter.emit('error', new Error('エラー'))

