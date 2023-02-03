const events = require('events')
// EbentEmitterインスタンスの生成
const event = new events.EventEmitter()

// try {
//     // リスナの関数
//     // const func = () => new Error('えらー')
//     const func = () => console.log("fun")

//     // testイベントのリスナ登録
//     event
//         .on('test', () => func())
//         .on('test2', () => console.log('イベントが通知されました2'))
//         // onceメソッドでtestイベントのリスナ登録
//         .once('once', () => console.log('1度だけ実行'))
//         // offメソッドでtestイベントのリスナ削除
//         .off('test', () => func)
//         .on('error', (err) => console.log(err.message))
// } catch (error) {
//     // console.log(error.message)
// }

// try {
//     // イベントを発火させる
//     // event.emit('error')
//     event.emit('test')

// } catch (error) {
//     console.log('2', error.message)
// }
// event.emit('error', new Error('えら'))
// // event.emit('test')
// event.emit('once')
// event.emit('test2')
// event.emit('test', 'once') // onceは実行されない
// event.emit('once') // onceは実行されない

// try {
//     const func = () => {
//         throw new Error('えらー')
//     }
//     event.on('test', () => func())


//     event.on('test2', () => {
//         throw new Error("エラー") // なぜキャッチできない？
//     })
//         .on('test3', () => {
//             throw new Error("エラーエラー") // なぜキャッチできない？
//         })
//         .on('error', (err) => console.log(err))

//     try {
//         event.emit('test2')
//     } catch (error) {
//         console.log(error.message)
//     }
//     event.emit('test2')
//     event.emit('test3')
// } catch (error) {
//     console.log('3', error.message)
// }

// const ee = new events.EventEmitter()
// // EventEmitterインスタンスのonメソッドはEventEmitterオブジェクトを返す
// const ev = new events.EventEmitter().on('B', () => console.log('B'))
// // eventsモジュールのonメソッドはなぜPromiseを返すのか？
// const promise = events.on(ee, 'A')
// console.log(ev)
// console.log(promise)
// ev.then
// ee.emit('A', console.log('AA'))
// ee.emit('B')

const e = new events.EventEmitter();
e.on('e', (...arg) => {
    //イベントの発生時に実行する処理
    console.log(arg)
});

// 非同期としてemitする処理をキューに追加する
process.nextTick(() => {
    e.emit('e', 1, 2, 3)
    e.emit('e', 2)
    e.emit('e', 3)
})

const promise2 = events.on(e, 'e');

(async () => {
    for await (const v of promise2) {
        console.log('async:', v)
    }
})().catch(err => console.log(err.message))