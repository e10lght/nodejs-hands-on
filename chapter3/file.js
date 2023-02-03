const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const yargs = require('yargs')
const { readFile, writeFile, mkdir } = require('fs/promises')
const { argv } = require('process')
dayjs.extend(isBetween)

const readCSV = async () => {
    const contents = await readFile('file/message.csv', { encoding: 'utf8' });
    const rows = contents.split('\n')
        .filter((line) => line !== '\r' && line !== '')  // 空行を除外する
        .map((line) => line.split(','))

    rows.shift()
    return rows
}

const setCount = async (type) => {
    const rows = await readCSV()
    const dataTypes = ['再点', '切り替え']
    const count = {}

    const beginDate = dayjs(rows[0][0])
    const endDate = dayjs(rows[rows.length - 1][0])
    const diff = endDate.diff(beginDate, type)

    for (let i = 0; i <= diff; i++) {
        const category = dataTypes.map((dataType) => ({ [dataType]: 0 }))

        count[beginDate.add(i, type).format('YYYY/MM/DD')] =
            dataTypes.reduce((acc, cur) => {
                acc[cur] = 0;
                return acc;
            }, {})
    }
    return count
}
setCount('week')

// 日毎に何件かを種別ごとにカウント
const dialyCount = async () => {
    const rows = await readCSV()
    const count = await setCount('day')

    rows.forEach((item) => {
        count[item[0]][item[1]]++;
    });
    return count;
}

// 週毎に何件かを種別ごとにカウント
const weeklyCount = async () => {
    const rows = await readCSV()
    const count = await setCount('week');
    let i = 0
    rows.forEach((item, index) => {
        const target = dayjs(item[0])
        const weekRange = Object.keys(count)

        const targetWeek = weekRange.find((week, index) => {
            return target.isBetween(dayjs(week), dayjs(weekRange[index + 1]), null, '[)');
        });
        if (targetWeek) {
            count[targetWeek][item[1]]++;
        }
    });
    return count;
}

// 週毎に何件かを種別ごとにカウント
const monthlyCount = async () => {
    const rows = await readCSV()
    const count = await setCount('month');
    rows.forEach((item, index) => {
        const target = dayjs(item[0])
        const monthRange = Object.keys(count)

        const targetMonth = monthRange.find((month, index) => {
            return target.isBetween(dayjs(month), dayjs(monthRange[index + 1]), null, '[)');
        });
        if (targetMonth) {
            count[targetMonth][item[1]]++;
        }
    });
    return count;
}

const writeFileText = async (countData, dir) => {

    // 下記の処理は呼び出し側でやった方がいいかな
    const keys = Object.keys(countData)
    const res = keys.map((date) => {
        const categories = Object.keys(countData[date])
        const categoryResult = categories.map((category) => {
            return ` ${category}:${countData[date][category]}`
        }).join('') + ('\n')

        return date + categoryResult
    })
    try {
        if (typeof dir === 'string') {
            await mkdir(`file/${dir}`, { recursive: true });
            await writeFile(`file/${dir}/result.txt`, res);
        } else {
            await writeFile('file/result.txt', res);
        }
        return '書き込み完了'
    } catch (error) {
        return error.message
    }
}

// yargsの引数に応じて出力する
const main = async () => {

    const counts = [
        { key: 'monthly', count: monthlyCount },
        { key: 'weekly', count: weeklyCount },
        { key: 'daily', count: dialyCount },
    ]

    // コマンドが指定の文字列かどうかを見つける
    const a = counts.find(count => yargs.argv[count.key])
    if (!a) throw new Error('コマンドに誤りがあります')

    for (const { key, count } of counts) {
        if (yargs.argv[key] && yargs.argv.dir) {
            const dir = yargs.argv.dir;
            const data = await count()
            const res = await writeFileText(data, dir)
            console.log(res)
        } else if (yargs.argv[key]) {
            const data = await count()
            console.log(data)
        }
    }
}

const main2 = async () => {
    try {
        await main();
    } catch (error) {
        console.log(error.message)
    }
}
main2()
