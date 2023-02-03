const dayjs = require('dayjs')
const isBetween = require('dayjs/plugin/isBetween')
const yargs = require('yargs')
const path = require('path');
const { readFile, writeFile, mkdir } = require('fs/promises')
dayjs.extend(isBetween)

class Count {

    dir;
    constructor(dir) {
        this.dir = dir;
    }

    readCSV = async (pathname) => {
        try {
            const contents = await readFile(pathname, { encoding: 'utf8' });
            const rows = contents.split('\n')
                .filter((line) => line !== '\r' && line !== '')  // 空行を除外する
                .map((line) => line.split(','))

            rows.shift()
            return rows
        } catch (error) {
            throw new Error('指定されたファイルが見つかりません' + error.message)
        }
    }

    setCount = async (type) => {
        const rows = await this.readCSV(this.dir)
        const dataTypes = ['再点', '切り替え']
        const count = {}

        if (!rows.length) throw new Error('データがありません')

        const beginDate = dayjs(rows[0][0])
        const endDate = dayjs(rows[rows.length - 1][0])
        const diff = endDate.diff(beginDate, type)

        for (let i = 0; i <= diff + 1; i++) {

            count[beginDate.add(i, type).format('YYYY/MM/DD')] =
                dataTypes.reduce((acc, cur) => {
                    acc[cur] = 0;
                    return acc;
                }, {})
        }
        console.log(count)
        return count
    }

    // 日毎に何件かを種別ごとにカウント
    dialyCount = async () => {
        const rows = await this.readCSV(this.dir)
        const count = await this.setCount('day')

        rows.forEach((item) => {
            count[item[0]][item[1]]++;
        });
        return count;
    }

    // 週毎に何件かを種別ごとにカウント
    weeklyCount = async () => {
        const rows = await this.readCSV(this.dir)
        const count = await this.setCount('week');
        rows.forEach((item, index) => {
            const target = dayjs(item[0])
            const weekRange = Object.keys(count)
            // console.log(weekRange[weekRange.length - 1])

            const targetWeek = weekRange.find((week, index) => {
                // console.log(target.format('YYYY-MM-DD'))
                // console.log(dayjs(week).format('YYYY-MM-DD'))
                // console.log(dayjs(weekRange[index + 1]).format('YYYY-MM-DD'))
                return target.isBetween(dayjs(week), dayjs(weekRange[index + 1]), null, '[)');
            });
            if (targetWeek) {
                count[targetWeek][item[1]]++;
            }
        });
        return count;
    }

    // 週毎に何件かを種別ごとにカウント
    monthlyCount = async () => {
        const rows = await this.readCSV(this.dir)
        const count = await this.setCount('month');
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

    writeFileText = async (countData, dirname, pathname) => {
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
            if (typeof dirname === 'string') {
                await mkdir((pathname + `/file/${dirname}`), { recursive: true });
                await writeFile((pathname + `/file/${dirname}`) + `/result.txt`, res);
                return '書き込み完了'
            } else {
                // console.log(__dirname)
                await writeFile((pathname + '/file/result.txt'), res);
                return '書き込み完了'
            }
        } catch (error) {
            return error.message
        }
    }

    // yargsの引数に応じて出力する
    output = async () => {

        const counts = [
            { key: 'monthly', count: this.monthlyCount },
            { key: 'weekly', count: this.weeklyCount },
            { key: 'dialy', count: this.dialyCount },
        ]

        // コマンドが指定の文字列かどうかを見つける
        const a = counts.find(count => yargs.argv[count.key])
        if (!a) throw new Error('コマンドに誤りがあります')

        for (const { key, count } of counts) {
            if (yargs.argv[key] && yargs.argv.dir) {
                const dir = yargs.argv.dir;
                const data = await count()
                const res = await this.writeFileText(data, dir, __dirname)
                console.log(res)
            } else if (yargs.argv[key]) {
                const data = await count()
                console.log(data)
            }
        }
    }

    main2 = async () => {
        try {
            await this.output();
        } catch (error) {
            console.log(error.message)
        }
    }
}

const count = new Count('file/message.csv')
const main = async () => {
    await count.main2()
}
main()

module.exports = { Count }