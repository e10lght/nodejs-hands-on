function* gen() {
    console.log('ジェネレータ関数実行');
    console.log('yield 1');
    yield 1
    console.log('yeeld 2')
    yield 2
    console.log('yeeld 3')
    yield 3
    return 'ジェネレータ関数';
}

const genp = gen();
console.log(genp);

/** genp.next()でyield1までを実行
 * 戻り値は、
 * {value: yieldの戻り値, done: ジェネレータがすべて実行されたかtrue/false} 
 **/
console.log(genp.next());
genp.next();  // yield2までを実行
genp.next();  // yield3までを実行
console.log(genp.next())  // {value: 'ジェネレータ関数', done: true}

console.log('-------------');
/** イテレータ */
const gen2 = gen();
for (value of gen2) {
    console.log(value);
}

console.log('-------------');
/** ジェネレータ特有の機能、next()に引数を渡す */
function* ge() {
    let count = 0;
    let str = 'ははは';
    while (true) {
        console.log('実行')
        if (yield count++) {  // if文の条件の中で返している
            console.log(count);
            count = 0;
            console.log(count);
        }
        // if(yield str) {
        //     str = 'ひひひ';
        // }
    }
}
const ge1 = ge();
console.log(ge1.next());
console.log(ge1.next());

console.log(ge1.next(true));
// console.log(ge1.next());

// console.log(ge1.next());
// console.log(ge1.next());
// console.log(ge1.next());
// console.log(ge1.next());
// yield の返り値を true に設定することで、ジェネレータを再開することができます

// 非同期的にJSONをパースする関数（再掲） 
function parseJSONAsync(json) {
    return new Promise((resolve, reject) =>
        setTimeout(() => {
            try {
                resolve(JSON.parse(json))
            } catch (err) {
                reject(err)
            }
        }, 1000)
    )
}
// asyc/await構文を利用した非同期処理 
async function asyncFunc(json) {
    try {
        const result = await parseJSONAsync(json)
        console.log('パース結果', result)
    } catch (err) {
        console.log('エラーをキャッチ', err)
    }
}
asyncFunc('{ "foo": 1 }')

async function pauseAndResume(pausePeriod) {
    console.log('pauseAndResume開始')
    await new Promise(resolve => setTimeout(resolve, pausePeriod))
    console.log('pauseAndResume再開')
}

pauseAndResume(100)
console.log('async関数外の処理はawaitの影響を受けない')

/** js **/
function parseJSONAsync(json) {
    return new Promise((resolve, reject) => {
        try {
            resolve(JSON.parse(json))
        } catch (err) {
            reject(err)
        }
    })
}

const tes = () => {
    return new Promise((resolve) => {
        resolve('OK!');
    })
}
// resが参照できないパターン
// parseJSONAsync('{ "foo": 1 }')
//     .then(res => console.log(res))
//     .then(res1 => console.log(res))

// resが参照できるパターン（Promiseをネスト化する）
tes()
    .then(res => {
        console.log(res)
        return tes()
            .then(res => {
                console.log(res)
            })
    }
    )

'use strict;'
const axios = require('axios');

(async () => {
    const res = await axios.get('https://api.github.com/zen');
    console.log(res.data);
})();
console.log('-----------')

const asyncIterable = { 
    [Symbol.asyncIterator]() { 
      let i = 0 
      // asyncイテレータ 
      return { 
        // value、doneプロパティを持つオブジェクトで解決されるPromiseを返す 
        next() { 
          if (i > 3) { 
            return Promise.resolve({ done: true }) 
          } 
          return new Promise(resolve => setTimeout( 
            () => resolve({ value: i++, done: false }), 
            100 
          )) 
        } 
      } 
    } 
  } 
  
  for await (const element of asyncIterable) { 
    console.log(element) 
  } 