const events = require('events');
const eventBEmitter = new events.EventEmitter()
const eventBPromise = events.once(eventBEmitter, 'eventB')
eventBPromise.then(arg => console.log('eventB発生', arg))
eventBEmitter.emit('eventB', 'Hello', 'World') // eventB発生 [ 'Hello', 'World' ]
eventBEmitter.emit('eventB', 'Hello', 'World') // 実行されない
/**
 * ただし、このケースはonceの1回きりのイベントの場合に使える。
 * （Promiseで処理できたほうが便利）
 */