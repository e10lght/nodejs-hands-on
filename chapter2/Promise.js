/**
 * Promiseは非同期処理の状態と結果を表現するオブジェクト
 */

const parseJSONAsync = (json) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(JSON.parse(json))
            } catch (error) {
                reject(error)
            }
        }, 1000)
    })
}

// const toBeFulfilled = parseJSONAsync('{"foo": 1}') 
// const toBeRejected = parseJSONAsync('不正なJSON') 
// console.log('*************** Promise生成直後 ***************') 
// console.log(toBeFulfilled) 
// console.log(toBeRejected) 
// setTimeout(() => { 
//   console.log('******************** 1秒後 ********************') 
//   console.log(toBeFulfilled) 
//   console.log(toBeRejected) 
// }, 1000) 

/**
 * 非同期処理の結果をハンドリングするためのインスタンスメソッド３つ
 * 「Promiseの結果を得るにはハンドラを使って値を返す必要がある（重要）」
 */

/**  thenはPromiseインスタンスの状態がfulfilledまたはrejectedになったとき
 * 実行するコールバック(onFulfilled, onRejected)を登録するメソッド
*/
const strPromise = Promise.resolve('{"xxx": 1}');
// console.log(strPromise);
const numPromise = strPromise.then((str) => str.length);
// console.log(numPromise);

// const asyncFunc1 = () => Promise.resolve("hello world");
// asyncFunc1()
//     // asyncFunc1完了後、その結果を引数にasyncFunc2を実行
//     .then((str) => {
//         console.log(str)
//         throw new Error("えらーだよ")
//         return str;
//     })
//     // asyncFunc2完了後、その結果を引数にasyncFunc3を実行
//     .then((str, err) => {
//         console.log(str)
//     }, console.log("エラ" + err))
//     // asyncFunc3完了後、その結果を引数にasyncFunc4を実行
//     .then((str) => console.log(str))
//     .then(result => {
//         // すべての非同期処理が完了したあとの処理
//         console.log(result);
//     })
//     .catch(err => {
//         // エラーハンドリング
//         console.log(err);
//     })
// asyncFunc1();

const hi = (name) => {
    return new Promise((resolve, reject) => {
        if (name) {
            resolve(`hi ${name}`)
        } else {
            reject("エラーだよ")
        }
    })
}
// hi()
// .then((res)=> {
//     // onFulfilledコールバック
//     console.log(res)
//     return res;
// },
// (err) => {
//     // onRejectedコールバック(catch推奨)
//     // 仮にonRejected中にエラーが発生した場合、
//     // thenの戻り値のPromiseはその発生したエラーを理由に拒否される
//     console.log(err)
//     return Promise.reject("エラー×２");
// })
// .then((res)=> {
//     /**
//      * チェーンしたthen内のコールバックはスコープが異なるので、
//      * 前のthenで受け取った値を直接参照できない。
//      * 1つ目のthenのres,errと2つ目のthenのres,errは全くの別物
//      */
//     // onFulfilledコールバック
//     console.log(res + "はい")
// }
// ,
// (err) => {
//     /**
//      * ・元のPromiseが拒否された場合に、
//      *   onReject()を省略すると同じ理由で拒否される。
//      * 
//      * ・rejectされた際の記述がない場合、下記エラーが発生（日本語訳）
//      *   UnhandledPromiseRejection: このエラーは、catchブロックなしで非同期関数内でスローしたか、
//      *   .catch() で処理されなかった promise を拒否したことが原因で発生しました。 
//      *   Promiseは「エラー×２」という理由で拒否されました。
//      **/ 
//     console.log(err)
// }
// )
// .catch((err) => {
//     // ・Promiseが拒否された際に実行
//     // ・エラー箇所以降は実行されない
//     // ・onReject()を省略することができる（こっちを推奨）
//     /**
//      * なぜonRejectedではなくcatchが推奨なのか？
//      * onRejectedではonFulfilledでエラーが発生した場合、
//      * キャッチすることができないが、catchを使えばこの場合もエラーハンドリングが可能のため。
//      */
//     console.log("catchした："+ err)
// })
// .finally(() => {
//     // console.log("最後！")
//     throw new Error("大変だ！")
// })

const a = () => new Promise(resolve => setTimeout(resolve, 1000))
const s = performance.now();
console.log(s);
/** 逐次実行すると約4秒かかる処理 */
a().then(a).then(a).then(a).then(() => console.log("逐次実行時間：", (performance.now() - s) / 1000))
/** 並列実行で約1秒で処理 */
Promise.all([a(), a(), a(), a()]).then(() => console.log("逐次実行時間：", (performance.now() - s) / 1000))

/** Promise.race() */
const wait = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}
const full = Promise.race([
    wait(30).then(() => 1),
    wait(10).then(() => 1),
    wait(20).then(() => 1)
])
console.log(full);

/** Promise.race()を使ったタイムアウトの実装 */
const timeout = (promise, timeout) => {
    return Promise.race([
        promise,
        new Promise((reject) => (
            setTimeout(() => (
                reject(new Error("タイムアウト"), timeout))
            ))
        )
    ])
}
const promise = new Promise(resolve => setTimeout(resolve("vv"), 3000))
const xxx = timeout(Promise.resolve, 3)
console.log(xxx)
const util = require('util');

// コールバックスタイルの関数
function callbackStyleFunction(data, delay, callback) {
  setTimeout(() => {
    callback(null, data);
  },
  delay);
}

// Promiseスタイルの関数にラップする
let promiseStyleFunction = util.promisify(callbackStyleFunction);

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