// const events = require('events')
// const eventAEmitter = new events.EventEmitter()

const events = require('events');
const eventAEmitter = new events.EventEmitter();

// 以下、同じ


// asyncイテラブルの生成
const eventAIterable = events.on(eventAEmitter, 'eventA')

// リスナが1つ登録されることを確認
eventAEmitter.listeners('eventA')
    // Entering editor mode (^D to finish, ^C to cancel)
    // プログラムの実行がfor await...ofの先に進めるよう、 
    // IIAFE（即時実行async関数式）を使う 
    (async () => {
        for await (const a of eventAIterable) {
            // aの値はeventAをemit()したときの引数の配列 
            if (a[0] === 'end') {
                // endが渡されたらループを抜ける 
                break
            }
            console.log(a)
        }
    })()
eventAEmitter.emit('eventA', 'Hello')
eventAEmitter.emit('eventA', 'Hello', 'World')
eventAEmitter.emit('eventA', 'end')
eventAEmitter.listeners('eventA') 