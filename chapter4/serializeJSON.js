const circular = { bar: new Date(2021, 8, 19) }

// TypeError: Converting circular structure to JSON 
// 循環構造を JSON に変換しています
const serializeCircular = JSON.stringify(circular)
JSON.parse(serializeCircular)

console.log(serializeCircular)
console.log(serializeCircular.bar instanceof Date)