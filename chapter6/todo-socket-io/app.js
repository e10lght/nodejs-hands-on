'use strict'
const http = require('http')
const next = require('next')
const { title } = require('process')
const Server = require('socket.io')
const { Socket } = require('socket.io-client')

let todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true },
]

// TODOのIDの値を管理するための変数
let id = 2

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })

nextApp.prepare().then(
    () => {
        // Next.jsのリクエストハンドラを引数にhttp.createServer()を実行
        const server = http.createServer(nextApp.getRequestHandler()).listen(3006)

        const io = Server(server)
        // /todos名前空間で接続待機
        const ioTodos = io.of('/todos')
        ioTodos.on('connection', socket => {
            console.log('connected')
            socket.emit('todos', todos)

            // 接続したクライアントから各種イベントに対応
            // TODOの作成
            socket
                .on('createTodo', title => {
                    if (typeof title !== 'string' || !title) {
                        return
                    }
                    const todo = { id: id += 1, title, completed: false }
                    todos.push(todo)
                    ioTodos.emit('todos', todos)
                })
                // completedの更新
                .on('updateCompleted', (id, completed) => {
                    todos = todos.map(todo => todo.id === id ? { ...todo, completed } : todo)
                    ioTodos.emit('todos', todos)
                })
                // Todo削除
                .on('delete', id => {
                    todos = todos.filter(todo => todo.id !== id)
                    ioTodos.emit('todos', todos)
                })
        })
    },
    err => {
        console.log(err)
        process.emit(1)
    }
)