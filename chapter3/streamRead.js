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

const helloReadableStream = new HelloReadableStream()
helloReadableStream
    .on('readable', () => {
        console.log('readable')
        let chunk
        while ((chunk = helloReadableStream.read()) !== null) {
            console.log(`chunk: ${chunk.toString()}`)
        }
    })
    .on('end', () => console.log('end'))


// const read = fs.createReadStream(__dirname + '/file/dummy2.csv');
// read.on('data', (chunk) => {
//     // console.log(chunk) // バッファとして取得
//     console.log(chunk.toString())
// });

// read.on('readable', () => {
//     console.log('readable');
//     let chunk;
//     let i = 1;
//     while ((chunk = read.read()) !== null) {
//         console.log(`${i} chunk: ${chunk.toString()} \nここまで${i}`)
//         i++;
//     }
// })

// read.on('end', () => {
//     console.log('データの読み取りが終了しました');
// });