const events = require('events')

try {
    new events.EventEmitter()
        // `error`イベントリスナの登録をコメントアウト
        // .on('error', err => console.log('errorイベント'))
        .emit('error', new Error('エラー'))
} catch (err) {
    console.log('catch')
    console.log(err.message)
}