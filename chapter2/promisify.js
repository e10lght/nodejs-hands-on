const { promisify } = require('util')

const test = () => {
    return 3 * 2;
}
// console.log(test())

const p = promisify(test)

// console.log(p())


// promisifyが使用できる条件
// ①引数の最後でコールバック関数をとる
// ②コールバック関数がとる引数の最初の引数はエラー
function doSomething(arg1, arg2, callback) {
    setTimeout(() => {
        // 第一引数がerr,第二引数がdata
        callback(null, arg1 * arg2)
    },
        1000);
}
// 通常のコールバックで処理する場合
doSomething(2, 3, (err, data) => { console.log(data) })

// promisifyでpromise化して処理する場合
const d = promisify(doSomething);
d(3, 4)
    .then(res => console.log(res))
    .catch(err => console.log(err));

// 条件がない場合でもpromisify.customプロパティにカスタマイズしたpromisifyを定義すれば
// promisifyとして利用することもできる
setTimeout[promisify.custom]
const time = promisify(setTimeout)
time(2500).then(res => console.log('2500ms'))

// コールバックスタイルの関数
function callbackStyleFunction(data, delay, callback) {
    setTimeout(() => {
        callback(null, data);
    },
        delay);
}
// Promiseスタイルの関数にラップする
let promiseStyleFunction = promisify(callbackStyleFunction);
// Promiseスタイルの関数を使用する
promiseStyleFunction(10, 3000)
    .then((data) => {
        // Promiseが成功した場合
        console.log('data = ' + data);
    })
    .catch((err) => {
        // Promiseが失敗した場合
        console.log('err' + err);
    });