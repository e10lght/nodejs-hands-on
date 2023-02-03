const fs = require('node:fs');
const crypto = require('node:crypto')
const stream = require('node:stream');
const { errorMonitor } = require('node:events');


// 読込ストリームはasyncイテラブルであるため、そのままfor await ofで使用できる
const rs = fs.createReadStream(__dirname + '/file/hello.txt', {
    encoding: "utf-8",
    highWaterMark: 6,
});

// try {
//     let i = 0;
//     // 無名の非同期関数でも処理可能
//     (async () => {
//         for await (const data of rs) {
//             console.log(data)
//             i++;
//             if (i === 3) {
//                 throw new Error('えらーですよ')
//             }
//         }
//     })()
// } catch (error) {
//     console.log(error.message)
// }

async function main() {
    try {
        let i = 0;
        for await (const chunk of rs) {
            console.log(chunk);
            i++;
            if (i === 3) {
                throw new Error('えらー')
            }
        }
    } catch (error) {
        // console.log(error.message)
        return error;
    }
}
// try {
//     const test = 0;
//     const res = new Promise((resolve, reject) => {
//         if (test === 0) {
//             resolve('成功')
//         } else {
//             reject('失敗')
//         }
//     })
//     console.log(res)
//     const res2 = new Promise((resolve, reject) => {
//         if (test === 1) {
//             resolve('成功')
//         } else {
//             reject('失敗')
//         }
//     })
//     // res2.then((res) => console.log(res)).catch((err) => console.log(err))
//     Promise.all([res, res2]).then((res) => console.log(res)).catch((err) => console.log(err))

//     // main().then((res) => console.error(res.message))
// } catch (error) {
//     console.log(error.message)
// }

// // 読込ストリーム
// let val = ''
// const rs2 = fs.createReadStream(__dirname + '/file/hello.txt', {
//     encoding: "utf-8",
//     highWaterMark: 8
// });

// rs2.on('data', (chunk) => {
//     console.log(chunk)
//     val += chunk;
//     if (chunk === 'txtに') {
//         rs2.pause(); // 読込を一時停止
//         console.log('pause!')
//         rs2.resume()  // 再開
//         console.log('resume!')
//     }
// })
// rs2.on('end', () => {
//     console.log('おわり')
//     console.log(val)
// })
// rs2.on('error', (err) => {
//     console.log('エラーだよ')
//     console.log(err.message)
// })


// 流れるデータ量を調整しながら読込と書き込みを行う
// const rs3 = fs.createReadStream(__dirname + '/file/hello.txt', {
//     encoding: "utf-8",
//     highWaterMark: 16,
// });

// const ws = fs.createWriteStream("dest.txt", {
//     highWaterMark: 64,
// });

// ws.on("drain", () => {
//     console.log("drain!");
//     rs3.resume(); // 読み込みを再開する
// });

// rs3.on("data", (chunk) => {
//     console.log(chunk)
//     const ok = ws.write(chunk);
//     if (!ok) {
//         console.log('pause!')
//         rs3.pause(); // 読み込みを一時停止する
//     }
// });

// 書込ストリーム：pipeメソッドで自動調整を行う例
let i = 0
const rs4 = fs.createReadStream(__dirname + '/file/message.txt', {
    encoding: "utf-8",
    highWaterMark: 6,
});

const b = async () => {
    return 1;
}
const c = async () => {
    throw new Error('えららら')
}
const a = async () => {
    let i = 0;
    try {
        await new Promise((resolve, reject) => {
            rs4.on('data', (chunk) => {
                console.log(i, chunk)
                i++

                b()
                    .then((res) => {
                        console.log(res)
                        c()
                            .catch((err) => {
                                console.log(err.message)
                                rs4.destroy()
                            })
                    })
                    .catch((err) => {
                        console.log(err.message)
                        // これで止める
                        rs4.destroy()
                    })

                // スローしても止まらない
                // reject(new Error('えらーえらー'));
            });
            rs4.on('end', () => {
                resolve();
            });
        });
    } catch (err) {
        console.log(err.message);
    }
}
// a()

//並行処理１(失敗)
const promise1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("promise1");
        resolve(new Error());
    }, 2000)
});
//並行処理２（失敗）
const promise2 = new Promise((resolve, reject) => {
    console.log("promise2");
    resolve(new Error());
});

Promise.all([promise1, promise2]).then((results) => {
    console.log("done");
    // console.log(results.message);  // undefined
    const includeError = results.some((result) => result instanceof Error);
    if (includeError) {
        console.log("promise error");
    }
}).catch(() => {
    console.log("error");
});


// let promises = []
// rs4
//     .on('data', (chunk) => {
//         i++
//         // イベント内でのエラーはイベント内でしか取れない？
//         // そうだとすれば、他イベントは問答無用で実行されていく
//         // ＝（何度もコミット、ロールバックのエラー）
//         try {
//             console.log(i)
//             promises = new Promise((resolve, reject) => {
//                 reject('失敗')
//             })
//                 .catch((err) => console.log(err))

//             // throw new Error('えらー')
//         } catch (err) {
//             console.error(err.message);
//         }
//     })
//     .on('end', () => {
//         console.log('データの読み取りが終了しました');
//     })
//     .on('error', (err) => {
//         console.log('読込でエラーがありました');
//         console.log(err.message);
//     })
//     .on("pause", () => {
//         console.log("----pause!----");
//     });

// const ws4 = fs.createWriteStream("dest.txt", {
//     highWaterMark: 64,
// });

// ws4
//     .on('finish', () => {
//         console.log('データの書込が終了しました')
//     })
//     // 必ずそれぞれのストリームに対してエラー処理(errorイベント)が必要
//     .on('error', (err) => {
//         console.log('書込でエラーがありました');
//         console.log(err.message);
//     });

// rs4.pipe(ws4);

// // エラーハンドリングが必要なケースではpipelineのほうが適している
// stream.pipeline(rs4, ws4,
//     err => err ? console.log('エラー発生', err.message) : console.log('正常終了')
// )

// // ストリームが異常終了するような場合（httpリクエストが途中でストップするなど）
// stream.finished(
//     rs4.on('data', () => {
//         // throw new Error('えらー')
//     }),
//     // 第2引数のコールバックはend,finishなどのイベントがなくても実行される。
//     err => err ? console.log(err.message) : console.log('正常終了')
// )

// transformで書き込むデータを変形させる
// 読込データを暗号化してから書込
// crypto.createHash()が入力データを暗号化する変換ストリームを生成する
// 変換ストリーム：読み込んだデータを変換してから下流に流すストリームのこと
// rs4.pipe(crypto.createHash('SHA256')).pipe(ws4);

// asyncイテレータを使ったストリームの使用
// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const main = async () => {
//     const stream = fs.createReadStream(__dirname + '/file/message.txt', { encoding: 'utf8', highWaterMark: 6 });

//     let counter = 0;
//     for await (const chunk of stream) {
//         counter++;
//         console.log(chunk);
//         await sleep(1000);
//     }

//     console.log(counter);
// }

// main()
// main().then(() => console.log('done!')).catch((e) => console.error(e));



// エラーハンドリングする例
// fs.createReadStream(__dirname + '/file/message.txt', { encoding: "utf-8", })
//     .on('data', (chunk) => {
//         console.log(chunk)
//         throw new Error('えらー')  // なぜerrorイベントで補足されない？
//     })
//     .on('error', err => console.log('エラーイベント:', err.message))
//     .pipe(fs.createWriteStream('dest.txt'))
//     .on('error', err => console.log(err.message))

// const rs5 = fs.createReadStream(__dirname + '/file/message.txt',
//     { encoding: "utf-8", highWaterMark: 6 })
//     .on('data', async (chunk) => {
//         try {
//             console.log(chunk)
//             await out(chunk)
//             // throw new Error('えらー')
//         } catch (err) {
//             process.nextTick(() => rs5.emit('error', err));
//         }
//     })
//     .on('error', err => {
//         console.error(err.message);
//         // perform rollback here
//     });

// const out = async (chunk) => {
//     console.log('アウトプット：', chunk)
// }

// 最大使用メモリの計測
let maxMemory = 0
process.nextTick(() => {
    let memUsage = process.memoryUsage()
    if (memUsage.rss > maxMemory) {
        maxMemory = memUsage.rss
    }
})

process.on('exit', () => {
    console.log(`Max memory: ${maxMemory / 1024 / 1024}MB`)
})