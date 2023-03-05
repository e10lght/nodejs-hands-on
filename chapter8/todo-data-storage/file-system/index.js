'use strict'
const { extname } = require('path')
const fs = require('fs/promises')

const { readdir, readFile, writeFile, unlink } = require('fs').promises


exports.fetchAll = async () => {
    // 同一ディレクトリに存在するJSONファイルを全て取得
    const files = await fs.readdir(__dirname)
    const jsonFiles = files.filter(file => extname(file) === '.json')

    const readJSONFile = jsonFiles.map(async (file) => {
        const filedata = await fs.readFile(`${__dirname}/${file}`, 'utf-8')
        return JSON.parse(filedata)
    })

    const result = []
    for await (const data of readJSONFile) {
        // console.log(readJSONFile)
        result.push(data)
    }
    return result
}

/** fetchByCompleted()の実装 **/
exports.fetchByCompleted = completed => exports.fetchAll()
    .then(all => all.filter(todo => todo.completed === completed))

// writeFileの追加
exports.create = todo =>
    writeFile(`${__dirname}/${todo.id}.json`, JSON.stringify(todo))

/** update()の実装 **/
exports.update = async (id, update) => {
    const fileName = `${__dirname}/${id}.json`
    return readFile(fileName, 'utf8').then(
        content => {
            const todo = {
                ...JSON.parse(content),
                ...update
            }
            return writeFile(fileName, JSON.stringify(todo)).then(() => todo)
        },
        // ファイルが存在しない場合はnullを返し、それ以外はそのままエラーにする
        err => err.code === 'ENOENT' ? null : Promise.reject(err)
    )
}

// unlinkの追加(削除)
exports.remove = id => unlink(`${__dirname}/${id}.json`)
    .then(
        () => id,
        // ファイルが存在しない場合はnullを返し、それ以外はそのままエラーにする
        err => err.code === 'ENOENT' ? null : Promise.reject(err)
    )

