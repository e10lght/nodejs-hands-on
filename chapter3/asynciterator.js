// 非同期イテレータの生成
const asyncIterable = {
    [Symbol.asyncIterator]: async function* () {
        yield 1;
        yield 2;
        yield 3;
    }
};
const asyncIterator = asyncIterable[Symbol.asyncIterator]();

// 非同期イテレータの実行
async function main() {
    for await (const value of asyncIterator) {
        console.log(value);
    }
}

main();

// 非同期イテレータを使用しない方法
Promise.resolve(1)
    .then(value => Promise.resolve(value + 1))
    .then(value => Promise.resolve(value + 2))
    .then(value => console.log(value));  // 4

// 指定のミリ秒待つ非同期関数 sleep(msec) が定義済みとして...

async function* wakeUp() { // 「*」を付けて、ジェネレータであることを示す
    yield 'Zzzz...' // ジェネレータなので、yieldが使える
    await new Promise(resolve => setTimeout(resolve, 2000)) // asyncなので、awaitが使える
    yield 'Mornin!' // ジェネレータは複数回、結果を返せる
}
async function main2() {
    for await (const message of wakeUp()) {
        console.log(message)
    }
}
main2()