"use strict"
const fibonacci = (n) => {
    // nが１以下の場合はnを、それ以外の場合は直前の２つのフィボナッチ数の和を返す
    return n <= 1 ? n : fibonacci(n - 1) + fibonacci(n - 1)
}
module.exports = { fibonacci } 