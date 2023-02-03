const parseJSONAsync = (json) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                resolve(JSON.parse(json))
            } catch (error) {
                reject(error)
            }
        }, 1000)
    })
}
parseJSONAsync('{"ito": "kira"}')
.then((res) => console.log(res))

const func = async () => {
    const res = await parseJSONAsync('{"ito": "kira"}');  // こいつが解決しないと
    console.log(res);  // こいつで完了後の出力ができない（pendingのまま）
    return res
}
func()
// console.log(func())  // pending：同期で出力すると非同期での結果を待てない