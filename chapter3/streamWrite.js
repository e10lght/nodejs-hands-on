const stream = require('node:stream');

class LineTransformStream extends stream.Transform {
    // 上流から受け取ったデータのうち、下流に流していない分を保持するフィールド 
    remaining = ''
    constructor(options) {
        // push()にオブジェクトを渡せるようにする 
        super({ readableObjectMode: true, ...options })
    }

    _transform(chunk, encoding, callback) {
        console.log('_transform()')
        const lines = (chunk + this.remaining).split(',')
        // 最後の行は次に入ってくるデータの先頭と同じ行になるため、変数に保持 
        this.remaining = lines.pop()
        for (const line of lines) {
            // ここではpush()の戻り値は気にしない 
            this.push({ message: line, delay: line.length * 100 })
        }
        callback()
    }

    _flush(callback) {
        console.log('_flush()')
        // 残っているデータを流し切る 
        this.push({
            message: this.remaining,
            delay: this.remaining.length * 100
        })
        callback()
    }
}

const lineTransformStream = new LineTransformStream()
lineTransformStream.on('readable', () => {
    let chunk
    while ((chunk = lineTransformStream.read()) !== null) {
        console.log(chunk)
    }
})

lineTransformStream.write('foo,bar')
lineTransformStream.write('baz')
lineTransformStream.write('baz,bar,hoge')
lineTransformStream.end() 