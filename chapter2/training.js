/**
 * Promiseインスタンスがsettled状態になったあとに、
 * それ以上状態が遷移しないことを確認する。
 */
const prm = () => {
    return new Promise((resolve, reject) => {
        resolve('done!');
        console.log(1)  // Promiseの解決以外は実行される
        reject('no!');  // Promiseが解決(settled)後は状態遷移しない。
        resolve('hi!')
    })
}
prm().then((res, reject) => console.log(res));  // done!

/**
 * JSON文字列のパース結果をキャッシュし、同じ文字列に対するパースの要求に対しては、
 * キャッシュされた結果を使い回すparseJSONAsyncWithCache()をPromiseで
 * 実装するとどうなるかを確認する。
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
const cache = {}
async function parseJSONAsyncWithCache(json) {
    const cached = cache[json]
    if (cached) {
        console.log('キャッシュされてるよ')
        // return new Promise((resolve) => resolve(cached))
        return cached;
    }
    console.log('キャッシュされてないよ')
    const res = await parseJSONAsync(json)
    cache[json] = res;
    // return new Promise((resolve) => resolve(res))
    // asyncなので、返り値は明示しなくてもPromiseになる
    return res;
}
parseJSONAsyncWithCache('{"ito":"kira"}')
    .then((res) => {
        console.log('1回目の呼び出し')
        console.log(res);
        parseJSONAsyncWithCache('{"ito":"kira"}')
            .then((res) => {
                console.log(res)
            })
        console.log('2回目の呼び出し');
    })

/**
 * 参考書の答え
 */
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

// 問題に対する回答となる実装 
const parseJSONAsyncCache = {}
function parseJSONAsyncWithCache(json) {
    let cached = parseJSONAsyncCache[json]
    if (!cached) {
        cached = parseJSONAsync(json)
        parseJSONAsyncCache[json] = cached
    }
    return cached
}

// 動作確認 
parseJSONAsyncWithCache('{"message": "Hello", "to": "World"}')
    .then(result => console.log('1回目の結果', result))
    .then(() => {
        const promise = parseJSONAsyncWithCache(
            '{"message": "Hello", "to": "World"}'
        )
        console.log('2回目の呼び出し完了')
        return promise
    })
    .then(result => console.log('2回目の結果', result))
console.log('1回目の呼び出し完了')


/**
 * 数値で解決されるPromiseインスタンスの配列を引数にとり、
 * その合計値で解決されるPromiseインスタンスを返す関数を、
 * Promise.allSettled()を使って実装する。
 * 引数の配列にはrejectedなPromiseインスタンスも含まれうるとし、
 * その場合でも戻り値のPromiseインスタンスはrejectedにせず、
 * fulfilledなPromiseインスタンスだけを合計してください。
 * fulfilledなインスタンスが１つも含まれない場合は、
 * ０で解決されるPromiseインスタンスを返してください。
 */

/** 
 * こっちでも最終的な出力がPromiseでないものの、
 * 値自体はきちんと出力されている。
 */
let num = 0;
const allSettled = Promise.allSettled([
    Promise.resolve(1),
    Promise.reject(3),
    5
])
    .then((res) => {
        res.forEach((val) => {
            if (val.status === 'rejected') {
                return Promise.resolve(0);
            } else {
                num = num + val.value
            }
        })
        return num;
    })
    .then((num) => console.log(num))

/**
 * 少し書き換えたこっちのほうがシンプルかな。
 * 回答はPrommise.allSettledの引数を関数の引数から与える形だった。
 */

async function allSettledFunc() {
    let num = 0;
    const all = await Promise.allSettled([
        Promise.resolve(1),
        Promise.reject(3),
        5
    ])
    all.forEach((val) => {
        if (val.status === 'rejected') {
            return Promise.resolve(0);
        } else {
            num = num + val.value
        }
    })
    return num;
}
allSettledFunc()

/**
 * 上記と同じ関数をPromise.all()を使って書いてください。
 */
async function func() {
    let num = 0;
    const all = await Promise.all([
        Promise.resolve(1),
        Promise.reject(3),
    ].map(e => e.catch(() => 0)))

    all.forEach((val) => {
        num = num + val
    })
    return num;
}
func()

/**
 * キャッチされたらfulfilledを返す？
 */
const res = Promise.all([
    Promise.resolve(1),
    Promise.reject(3),
    5
]);
res.then((res) => console.log(1)).catch((e) => console.log(e))
