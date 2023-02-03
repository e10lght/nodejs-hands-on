const { setupMaster } = require('cluster')
const v8 = require('node:v8')

setupMaster({
    exec: `${__dirname}/circular`,
    // シリアライザで循環参照を扱えるようにadvancedを指定する
    serialization: 'advanced' // デフォはJSON
})


const circular = { bar: new Date(2021, 8, 19) }
// 循環参照させる
circular.foo = circular;

// <ref *1> { bar: 1, foo: [Circular *1] }
// fooの[Circular *1]に循環参照があることを示している
console.log(circular)

// TypeError: Converting circular structure to JSON 
// 循環構造を JSON に変換しています
// JSON.stringify(circular)

const serializeCircular = v8.serialize(circular)
const t = v8.deserialize(serializeCircular) // たぶん非破壊だから戻り値は変数に格納する
console.log(t)
console.log(serializeCircular)  // v8.serializeの戻り値
console.log(t.bar instanceof Date)  // trueになるので、正しいデータ型でシリアライズができている。