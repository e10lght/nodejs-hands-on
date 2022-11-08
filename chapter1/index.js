/**
 * オブジェクトリテラル
 * スプレッド構文を利用し、オブジェクトのすべてのキーと値の組を渡す
 **/ 
 const obj1 = {
    propA: 1,
    propB: 2
}
const obj2 = { ...obj1, propC: 3 }
console.log(obj2);  // { propA: 1, propB: 2, propC: 3 }

/**
 * イミュータブル(元のオブジェクトを変更しない)に行う際は、
 * スプレッド構文、レスト構文を利用する。
 */
const {propA, ...obj3} = obj2;
// 元のオブジェクトは不変
console.log(obj2)
// 新しく生成されたオブジェクトはpropAが削除されている
console.log(obj3)
// レスト構文によりpropAは切り離される
console.log(propA)