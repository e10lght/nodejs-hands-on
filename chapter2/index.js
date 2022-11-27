/* 同期的なエラーの補足 */
function parseJSONSync(json) {
    try {
        return JSON.parse(json);
    } catch (error) {
        console.log("エラーをキャッチ", error)
    }
}
// parseJSONSync("不正なJSON");

/* 非同期的なエラーの補足(キャッチされない) */
function parseJSONAsync(json, callback) {
    try {
        setTimeout(() => { callback(JSON.parse(json)) }, 100)
    } catch (error) {
        console.log("エラーをキャッチ", error)
        callback({})
    }
}
parseJSONAsync("不正なJSON", res => console.log("parseの結果", res));

/* 非同期的なエラーの補足(規約通り) */
function parseJSONAsync(json, callback) {
    setTimeout(() => {
        try {
            callback(JSON.parse(json))
        } catch (error) {
            console.log("エラーをキャッチ", error)
            callback({})
        }
    }, 1000)
}
parseJSONAsync('{"msg":"hello","to":"world"}', (err, res) => console.log("parseの結果", err, res));

/**
 * コールバックをパラメータとする関数は、
 * 常に同期的か非同期的かのどちらかでなければならない 
 **/
const cache = {};
function parseJSONAsyncWithCache(json, callback) {
    const cached = cache[json];
    if (cached) {
        // callback(cached.err, cached.res)
        // setTimeout(() => callback(cached.err, cached.res))
        process.nextTick(() => callback(cached.err, cached.res ))
        return
    }
    parseJSONAsync(json, (err, res) => {
        cache[json] = { err, res }
        callback(err, res)
    })
}

/**
 * 1度目のコールバックは非同期的に実行され、
 * ２度目のコールバックは同期的に実行されている
 */
parseJSONAsyncWithCache('{"msg":"hello","to":"world"}',
    (err, res) => {
        console.log("1回目の結果", err, res)

        // コールバック中で２回目を実行
        parseJSONAsyncWithCache('{"msg":"hello","to":"world"}',
            (err, res) => {
                console.log("2回目の結果", err, res);
            }
        )
        console.log("2回目の呼び出し完了")
    }
)
console.log("1回目の呼び出し完了")
