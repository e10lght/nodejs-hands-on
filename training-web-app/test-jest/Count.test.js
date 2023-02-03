const yargs = require('yargs');
const { mkdir, writeFile, readFile, appendFile } = require('fs/promises')
const { Count } = require('../Count')
const { expected, dialyExpected, weeklyExpected, monthlyExpected } = require('./expected/result')

describe('Countクラス', () => {

    describe('異常系', () => {
        const count = new Count(__dirname + '/../test/test2.csv')

        test('読込対象のCSVデータ存在しない場合throwする', async () => {
            await expect(count.readCSV(__dirname + '/../test/test99.csv')).rejects.toThrow();
        })
        test('カウント対象のデータがなかった場合にthorwされるか', async () => {
            await expect(count.setCount('week')).rejects.toThrow();
        })
    })

    describe('正常系', () => {

        const count = new Count(__dirname + '/../test/test.csv')

        test('読み込んだCSVデータを行単位に配列として返す処理', async () => {
            const result = await count.readCSV(__dirname + '/../test/test.csv')
            expect(expected).toEqual(result)
        })
        test('日次集計処理', async () => {
            const result = await count.dialyCount()
            await expect(dialyExpected).toEqual(result)
        })
        test('週次集計処理', async () => {
            const result = await count.weeklyCount()
            await expect(weeklyExpected).toEqual(result)
        })
        test('月次集計処理', async () => {
            const result = await count.monthlyCount()
            await expect(monthlyExpected).toEqual(result)
        })
        test('ファイルの書き込み処理', async () => {
            const testdata = { '2021/03/01': { '再点': 4, '切り替え': 1 } }
            await count.writeFileText(testdata, true, __dirname)
            const acctual = await readFile((__dirname + '/file/result.txt'), { encoding: 'utf8' });
            await expect(acctual).toEqual("2021/03/01 再点:4 切り替え:1\n")
        })
    })
});

