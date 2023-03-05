const fs = require('fs/promises')

const arr =
    [
        { id: '1', title: 'ネーム', completed: false },
        { id: '2', title: '下書き', completed: false },
    ]

const arrayToCSV = async (array) => {
    const header = Object.keys(array[0])
    let rows = header.join(',') + ('\n')
    for (const item of array) {
        const { id, title, completed } = item
        rows += id + ',' + title + ',' + completed + '\n'
    }
    await fs.writeFile('file.csv', rows)
}
arrayToCSV(arr)