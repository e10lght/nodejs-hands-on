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
const { propA, ...obj3 } = obj2;

/* 元のオブジェクトは不変 */
console.log(obj2)  // { propA: 1, propB: 2, propC: 3 }

/* 新しく生成されたオブジェクトはpropAが削除されている */
console.log(obj3)  // { propB: 2, propC: 3 }

/* レスト構文によりpropAは切り離される */
console.log(propA)  // 1

/* 同じプロパティ名が複数回登場する際は最後の値が参照される */
/* プロパティ名には計算された値も利用でき、その場合はプロパティ名を[]で囲う */
const obj4 = { propB: "b", propD: "d" };
console.log({ ...obj2, [obj4.propB + obj2.propC]: "ABC", ...obj4, propA: true });
console.log("----------------------")

/* プロパティの値を取得、設定する際に関数を実行するgetter,setterという機能もある */
const price = {
    value: 100,
    get withTax() {
        return Math.floor(this.value * 1.1)
    },
    set withTax(withTax) {
        this.value = Math.ceil(withTax / 1.1)
    }
}

console.log(price.withTax);
price.withTax = 300;
console.log(price.withTax);
console.log(price.value);

console.log(Object.keys(obj2)) // [ 'propA', 'propB', 'propC' ]
console.log(Object.values(obj2)) // [ 1, 2, 3 ]
console.log(Object.entries(obj2)) // [ [ 'propA', 1 ], [ 'propB', 2 ], [ 'propC', 3 ] ]
console.log("----------------------")

/* 配列 */
const arr1 = ["foo", "bar"];
console.log(arr1.length);  // 2
console.log(arr1[1]);  // bar
console.log(arr1.indexOf("bar"));  // 1
console.log(arr1.indexOf("baz"));  // -1
console.log(arr1.includes("bar"));  // true
console.log(arr1.includes("baz"));  // false
console.log(arr1.join("-"));  // foo-bar
console.log(arr1.join());  // foo,bar

/* 配列に要素を追加 */
console.log(arr1.push("baz"));  // 戻り地は配列の長さ[3]
/* 配列の末尾に複数要素を追加 */
console.log(arr1.push("a", "b", "c"));
/* 配列の末尾の要素を削除 */
console.log(arr1.pop());  // 戻り地は削除した要素
/* 配列の先頭の要素を削除 */
console.log(arr1.unshift("qux"))  // 戻り値は配列の長さ[6]
/* 配列の先頭に複数要素を追加 */
console.log(arr1.unshift("d", "e", "e"));
/* 配列の先頭の要素を削除 */
console.log(arr1.shift())  // 戻り値は削除した要素
console.log("----------------------")

/* イミュータブルに配列の追加・削除を行うにはスプレッド構文を利用 */
/* イミュータブルに配列の要素を追加 */
const arr2 = ["f", ...arr1];
console.log(arr1);  // 元の配列
console.log(arr2);
/* イミュータブルに配列の要素を削除 */
/* レスト構文ではレスト要素が配列の最後でなければならない */
const [head1, head, ...arr3] = arr2
console.log(arr2)  // 元の配列
console.log(arr3)
console.log(head1)  // 削除した要素

/* レスト構文では不都合がある場合はslice()で配列を切り出す */
console.log(arr2.slice(0, 2));
console.log("----------------------")


/**
 * 配列のメソッドを使用する際、その操作がイミュータブルかどうかには注意を払うようにしてください
 * メソッドが操作適用後、配列を返す場合はイミュータブルであるというルールではありません。
 * たとえば、sort()は配列を返しますが、元の配列にも操作を加えます。
 */
/* 引数なしでUTF-16コードの照準にソート */
console.log(arr2.sort());
console.log(arr2)  // 元の配列も操作される
/* 値を比較する関数を引数に指定する（ここでは文字数を昇順にソートする） */
console.log(arr2.sort((a, b) => a.length - b.length));
console.log(arr2) // 元の配列も操作される

/* 配列に対する反復処理 */
for (let i = 0; i < arr2.length; i++) { console.log(arr2[i]) }
console.log("----------------------")
for (val of arr2) { console.log(val) }
console.log("----------------------")

/* 高階関数による配列に対する反復処理 */
arr2.forEach((val) => {
    console.log(val);
})
console.log("----------------------")
console.log(arr2.map((val) => "*" + val + "*"))
console.log("----------------------")
console.log(arr2.filter((e) => e.startsWith("b")))
console.log("----------------------")
console.log(arr2.find((e) => e.length > 2))
console.log("----------------------")

/* クラス */
class Foo {
    // privateメンバ
    #privateField = 2;
    // publicメンバ
    publicField = 2;
    // staticなprivateメンバ
    static #staticPrivateField = 3;
    // staticなpuclicメンバ
    static staticPublicField = 4;

    // コンストラクタ
    constructor(param) {
        this.param = param;
        console.log("Foo constructor");
    }
    // privateなgetter 
    get #computed() {
        return this.publicField * 2
    }
    // publicなgetter 
    get computed() {
        return this.#computed
    }
    // privateなsetter 
    set #computed(value) {
        this.publicField = value / 2
    }
    // publicなsetter 
    set computed(value) {
        this.#computed = value
    }
    // privateメソッド 
    #privateMethod() {
        return this.#privateField
    }
    // publicメソッド 
    publicMethod() {
        return this.#privateField
    }
    // staticなprivateメソッド 
    static #staticPrivateMethod() {
        return this.#privateField
    }
    // staticなpublicメソッド 
    static staticPublicMethod() {
        return this.#staticPrivateField
    }
}

const FooInstace = new Foo("Hello World");
// console.log(FooInstace.#privateField);  // privateメンバにつき構文エラーとなる
console.log(FooInstace.publicField);
console.log(FooInstace.param);
FooInstace.computed = 10;
console.log(FooInstace.computed)
console.log(FooInstace.publicField)
console.log(FooInstace.staticPublicField)

// extendでクラスの継承
class Bar extends Foo {
    constructor(param) {
        super(param)
        this.subClassParam = 99;
        console.log("Bar constructor")
    }
    publicMethod() {
        return super.publicMethod() * this.subClassParam;
    }
}

const bar = new Bar(88);
console.log(bar.publicMethod())
console.log(bar.staticPublicField)  // undefined
console.log(Bar.staticPublicField)  // 4

/* プロトタイプチェーン */

/* CommonJS */
const math = require("./cjs-math");
console.log(math.add(4,5));
console.log(math.subtract(4,5));
console.log(require.cache)
console.log(require.resolve)

/* ディレクトリをロードする場合はディレクトリ内のindex.jsがロードされる */
const math2 = require("./cjs-math2")
console.log(math2);
console.log(math2.add(4,8));
/* jsonもロードできる。 */
const json = require("./key-value.json");
console.log(json)  // JSのオブジェクトとして、パースされた状態でロードされる
/* Node.jsのコアモジュールもrequireでロードする */
console.log(require("fs"))

console.log(__dirname)
console.log(__filename)