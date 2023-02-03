// const express = require("express");
// const app = express();
// require('dotenv').config();
// const port = process.env.PORT || 5002;
// console.log(process.env.PORT);

// app.get("/", (req, res, next) => {
//     res.send("Hello World");
// })

// app.listen(port, () => {
//     console.log(`listen ${port}`);
// })

const increment = (a, b) => {
    a = a + 1
    b = a
    console.log(this)  // {}
    return a + b
}
// const num = increment(2, 3)
// console.log(num)

function func() {
    console.log(this)  // <ref *1> Object [global] {・・・}
    return this // <ref *1> Object [global] {・・・}
}

function test(callback) {
    callback()
}

'use strict'
const con = {
    prop: 88
}
const obj = {
    prop: 45,
    connect: function () { return this.prop },
    connect3: function () { return this.prop }.bind(con),
    connect2: () => { return this.prop },
}

// bindでthisは変数conを指しているため、conのpropが参照される。
console.log(obj.connect3())  // 88

// bindはどこで呼ばれたかに関係なくthisの値をbindの引数の値に設定できるもの

/** function関数の場合 */
console.log(obj.connect())  // 45
const unbount = obj.connect;  // 代入時に参照されるthisがグローバルになる
console.log(unbount())  // undefined
const bound = obj.connect.bind(obj)  // bindにより参照されるthisが変数objになる
console.log(bound())  // 45

/** アロー関数の場合 */
// アロー関数の場合はthis使えないのか…？
console.log(obj.connect2())  // undefined
const unbount2 = obj.connect2;
console.log(unbount2())  // undefined
const bound2 = obj.connect2.bind(obj)
console.log(bound2())  // undefined