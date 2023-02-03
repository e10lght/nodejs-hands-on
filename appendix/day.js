const dayjs = require('dayjs')

dayjs('2018-08-08') // パース

// dayjs().format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A') // 表示
dayjs().format('{YYYY}/MM/DD') // 表示

dayjs()
    .set('month', 3)
    .month() // get & set

dayjs().add(1, 'year') // 操作

dayjs().isBefore(dayjs()) // クエリ
console.log(dayjs('2022-03-01').format('YYYY/MM/DD'))


// dayjsを使った日付の比較
const date1 = dayjs('2022-01-01');
const date2 = dayjs('2022-01-02');

console.log(date1.isBefore(date2));  // true:引数の日付よりも前
console.log(date1.isAfter(date2));   // false:引数の日付よりも後
console.log(date1.isSame(date2));    // false:同じ日

const date3 = dayjs('2022-01-01');
const date4 = dayjs('2022-01-01')
console.log(date3.isBefore(date4));  // false
console.log(date3.isAfter(date4));   // false
console.log(date3.isSame(date4));    // true


const target = dayjs('2022/03/01')
const s = dayjs('2022/03/01')
const e = dayjs('2022/04/03')
console.log(target)
console.log(s)
// 範囲を含む場合、isBetweenは第3引数のnullも指定しないといけない
console.log(target.isBetween('2022/03/01', e, null, '[]'))