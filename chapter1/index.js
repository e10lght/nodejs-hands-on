/**
 * イミュータブル(元のオブジェクトを変更しない)に行う際は、
 * スプレッド構文、レスト構文を利用する。
 **/ 

/* ---スプレッド構文の例--- */
 const obj1 = {
    propA: 1,
    propB: 2
}
const obj2 = { ...obj1, propC: 3 }
console.log(obj2);  // { propA: 1, propB: 2, propC: 3 }

/* ---レスト構文の例--- */
const {propA, ...obj3} = obj2;

/* 元のオブジェクトは不変 */
console.log(obj2)  // { propA: 1, propB: 2, propC: 3 }

/* 新しく生成されたオブジェクトはpropAが削除されている */
console.log(obj3)  // { propB: 2, propC: 3 }

/* レスト構文によりpropAは切り離される */
console.log(propA)  // 1