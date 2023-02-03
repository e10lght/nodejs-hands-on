const fs = require('node:fs');
const crypto = require('node:crypto')
const { generate } = require('csv');

// const csvdata = generate({ length: 5 })
// console.log(csvdata)
// csvdata.pipe(csv.parse()).pipe(process.stdout);
// const res = csvdata.pipe(csv.stringify());
// res.pipe(process.stdout);

// 最大使用メモリの計測
let maxMemory = 0
process.nextTick(() => {
    let memUsage = process.memoryUsage()
    if (memUsage.rss > maxMemory) {
        maxMemory = memUsage.rss
    }
})

const readStream = async () => {
    let fileData = ''
    const read = fs.createReadStream(__dirname + '/file/dummy.csv');
    read.on('data', (chunk) => {
        // console.log(chunk)
        // console.log(chunk.toString())
        fileData += chunk;
    });

    read.on('end', () => {
        console.log('データの読み取りが終了しました');
    });

    read.on('error', (err) => {
        console.error(`Error while reading the file: ${err.message}`);
    });

    const write = fs.createWriteStream((__dirname + '/file/hell.txt'))
    write.on('finish', () => {
        console.log("書き込みストリームが終了したよ");
    });
    write.on('pipe', () => {
        // pipeメソッドが"呼び出された時"に実行するので一番はやい
        console.log("書き込んでるよ！");
    });
    read.pipe(write)
    console.log('----------')
}
readStream()
// fs.writeFileSync((__dirname + '/file/hell.txt'), fs.readFileSync((__dirname + '/file/dummy2.csv')))

process.on('exit', () => {
    console.log(`Max memory: ${maxMemory / 1024 / 1024}MB`)
})