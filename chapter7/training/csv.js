const fs = require('fs/promises')

// CSVを読み込んで配列を返す
const csvToArray = async (filepath) => {
    const data = await fs.readFile(filepath, 'utf-8')
    const lines = data.split('\n')
    lines.pop()
    // lines.shift()  // shift使うより、、
    const [header, ...rows] = lines  // レスト構文使ったほうがシンプル

    const resultArray = rows.map(line => {
        const rows = line.split(',')
        // const [id, title, completed] = header.split(',')
        const headerValues = header.split(',')
        // const result = { [id]: rows[0], [title]: rows[1], [completed]: (rows[2] === 'true') };
        const todo = {}
        for (let i = 0; i < rows.length; i++) {
            todo[headerValues[i]] = headerValues[i] === 'completed' ? (rows[i] === 'true') : rows[i]
        }

        return todo
    })
    console.log(resultArray)
}

csvToArray(__dirname + '/file.csv')

