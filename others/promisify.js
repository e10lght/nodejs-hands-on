const util = require('util');
const fs = require('fs');
const stream = require('stream');


const readFile = util.promisify(fs.readFile);

readFile((__dirname + '/../chapter3/file/message.txt'), 'utf8')
    .then(data => console.log(data))
    .catch(err => console.error(err));


const finished = util.promisify(stream.finished);
const msleep = util.promisify(setTimeout);

// streamを用いた場合の処理(全体終了部分のみのpromise化)
const reader1 = async (rs) => {
    rs.on('data', (chunk) => {
        console.log(chunk);
    });

    await finished(rs);  // ストリームの読み書きができなくなった際に実行
    console.log('全て終了')


    // stream.finishedを使わない場合下記のようなpromiseを生成する
    // await new Promise((resolve, reject) => {
    //   rs.once('finished', (chunk) => {
    //     return resolve(data);
    //   });
    //   rs.once('error', (err) => {
    //     return reject(err);
    //   });
    // });
};
(async function () {
    const rs1 = fs.createReadStream((__dirname + '/../chapter3/file/message.txt'), { encoding: 'utf8', highWaterMark: 6 });
    await reader1(rs1);
    // const rs2 = fs.createReadStream('./input.txt', { encoding: 'utf8' });
    // await reader2(rs2, async (chunk) => {
    //     console.log(chunk);
    // });
})();