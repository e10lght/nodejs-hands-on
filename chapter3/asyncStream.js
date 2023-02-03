const fs = require('node:fs');
const stream = require('node:stream');

class HelloReadableStream extends stream.Readable {
    constructor(options) {
        super(options)
        this.languages = ['JavaScript', 'Python', 'Java', 'C#']
    }

    _read(size) {
        console.log('_read()')
        let language
        while ((language = this.languages.shift())) {
            // push()でデータを流す 
            // ただし、push()がfalseを返したらそれ以上流さない 
            if (!this.push(`Hello, ${language}!\n`)) {
                console.log('読み込み中断')
                return
            }
        }
        // 最後にnullを流してストリームの終了を通知する 
        console.log('読み込み完了')
        this.push(null)
    }
}

const helloReadableStream1 = new HelloReadableStream({ highWaterMark: 0 })
    .on('end', () => console.log('完了'))

const test = async () => {
    // for await ofはデータを蓄積してメモリを圧迫することはない
    // 後続処理が滞っていた場合は、読込もストップするようになっている。
    for await (const data of helloReadableStream1) {
        await new Promise(resolve => setTimeout(resolve, 100))
        console.log('data', data.toString())
    }
}
// test()

// asyncジェネレータ関数 
async function* asyncGenerator() {
    let i = 0
    while (i <= 3) {
        await new Promise(resolve => setTimeout(resolve, 100))
        // 読み込みストリームとして利用するため数値は使えないことに注意 
        yield `${i++}`
    }
}
const asyncIterable = asyncGenerator()
const readableFromAsyncIterable = stream.Readable.from(asyncIterable)
readableFromAsyncIterable.on('data', console.log) 