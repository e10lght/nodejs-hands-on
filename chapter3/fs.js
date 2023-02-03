const { mkdir, writeFile, readFile, appendFile } = require('fs/promises')
const path = require('path');

const fileCreateToWrite = async () => {
    // console.log(path.dirname(__dirname))
    try {
        console.log(__dirname)
        // const p = new URL(__dirname + 'chapter3')
        const dir = __dirname + '/file/hhh'
        console.log(__dirname + '/file')
        await mkdir(dir, { recursive: true });
        // const promise = await writeFile('file/message.txt', 'hello world');
        await appendFile((__dirname + '/file/message.txt'), '\nhello world')
        const contents = await readFile((__dirname + '/file/message.txt'), { encoding: 'utf8' });
        console.log(contents)
        return contents;
    } catch (error) {
        console.log(error.message)
    }
}
fileCreateToWrite()
const linesCount = async () => {

    const str = await fileCreateToWrite();
    const chars = str.split('\n')
    const res = chars.length;
    console.log(res)
    return res
}
// linesCount()

