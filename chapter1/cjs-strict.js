// "use strict";
let myString = "いろは";
myStrng = "いろはに";  // (strictモードの場合)ReferenceError: myStrng is not defined
console.log(myStrng)


const fs = require("fs")
fs.readdir(
    ".",
    (err, files) => {
        console.log("err", err)
        console.log("files",files)
    }
)