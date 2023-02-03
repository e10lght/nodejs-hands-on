const events = require('events')
const { resolve } = require('path')
// const { resolve } = require('path')
// // EbentEmitterインスタンスの生成
// // const eventEmitter = new events.EventEmitter()

// EventEmitterインスタンスの生成
// function createFizzBuzzEventEmitter(until) {
//     const eventEmitter = new events.EventEmitter()
//     // イベント含めた処理の実行
//     _emitFizzBuzz(eventEmitter, until)
//     return eventEmitter
// }
// console.log(createFizzBuzzEventEmitter(0))

// // async/await構文が使えるよう、イベントを発行する部分を別の関数に切り離す 
// async function _emitFizzBuzz(eventEmitter, until) {
//     // 同期的に実行される
//     eventEmitter.emit('start')
//     let count = 1
//     while (count <= until) {
//         await new Promise(resolve => setTimeout(resolve, 100))
//         if (count % 15 === 0) {
//             eventEmitter.emit('FizzBuzz', count)
//         } else if (count % 3 === 0) {
//             eventEmitter.emit('Fizz', count)
//         } else if (count % 5 === 0) {
//             eventEmitter.emit('Buzz', count)
//         }
//         count += 1
//     }
//     // 同期的に実行される
//     eventEmitter.emit('end')
// }

// // 各種リスナ
// function startListener() {
//     console.log('start')
// }
// function fizzListener(count) {
//     console.log('Fizz', count)
// }
// function buzzListener(count) {
//     console.log('Buzz', count)
// }
// function fizzBuzzListener(count) {
//     console.log('FizzBuzz', count)
// }
// function endListener() {
//     console.log('end')
//     this // thisはEventEmitterインスタンス 
//         // すべてのイベントからリスナを削除する 
//         .off('start', startListener)
//         .off('Fizz', fizzListener)
//         .off('Buzz', buzzListener)
//         .off('FizzBuzz', fizzBuzzListener)
//         .off('end', endListener)
// }

// // リスナの登録
// createFizzBuzzEventEmitter(0)
//     .on('start', startListener)
//     .on('Fizz', fizzListener)
//     .once('Buzz', buzzListener) // Buzzイベントだけonceで登録 
//     .on('FizzBuzz', fizzBuzzListener)
//     .on('end', endListener)


// function createFizzBuzzEventEmitter2(until) {
//     const event = new events.EventEmitter()
//     // イベントの発行を常に非同期にするため、process.nextTick()を利用 
//     process.nextTick(() => _emitFizzBuzz(event, until))
//     return event
// }
// createFizzBuzzEventEmitter2(0)
//     .on('start', startListener)
//     .on('end', endListener)

// // 
const fooEventEmitter = new events.EventEmitter()
fooEventEmitter.on('foo', () => {
    console.log('fooイベントリスナの実行')
})
console.log('fooイベント発行', fooEventEmitter.emit('foo'))


/**
 * 実際下記のような書き方をするか？
 */
// エミッターの生成
const emitter = () => {
    const EventEmitter = new events.EventEmitter()
    // process.nextTick(() => add(EventEmitter)) // 非同期にすることでリスナ登録後実行
    // await add(EventEmitter) // リスナが登録されていない
    return EventEmitter
}
// イベントを発火する関数
const add = async (emitter) => {
    return new Promise(resolve => {
        emitter.emit('c')
        resolve();
    })
}
// リスナー
const out = () => {
    console.log('C')
}
// リスナーの登録
emitter()
    .on('c', out)
    // add(emitter())
    .emit('c')

// イベントの実行(emit)は下記関数と同様の動きをする
const B = () => {
    console.log('B')
}
console.log('A', B(), 3)

const C = async () => {
    return new Promise(resolve => {
        // console.log('C')
        resolve('C')
    })
}
console.log('A', C(), 3)
async function t() {
    const r = await C();
    console.log('A', r, 3)
}
t()

/**
 * 注意：コールバックを使っているからといって必ずしも非同期とは限らない
 */

/**
 * MaxListenersExceededWarning: EventEmitterメモリリークの可能性が検出されました。
 *  [EventEmitter] に 11 個の bar リスナーが追加されました。 
 *  制限を増やすには、emitter.setMaxListeners() を使用します
 *  同じEventEmitterに11以上のリスナーが追加されるとエラーが出る。
 */
const barEventEmitter = new events.EventEmitter()
for (let i = 0; i < 11; i++) {
    barEventEmitter.on('bar', () => console.log('bar'))
}

{
    // ブロック内での変数の宣言
    const a = 1
}
// ブロック（aを参照しうるスコープ）が終了したらaが使われることはないため、
// GCの対象になる

const messageEventEmitter = new events.EventEmitter()
{
    // ブロック内での変数（listener）の宣言 
    const listner = () => console.log('Hello')
    messageEventEmitter.on('message', listner)
}
// console.log(a) // 参照できない(GC対象)
// console.log(listner) // 参照できない(GC対象)
console.log(messageEventEmitter.listeners('message')) // [ [Function: listner] ]

