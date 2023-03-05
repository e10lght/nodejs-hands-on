require('isomorphic-fetch')
const express = require('express')
const app = express()

const todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true }
]

app.use(express.json())

// TODO一覧の取得
app.get('/api/todos', (req, res, next) => {
    console.log(req.query.completed)
    if (!req.query.completed) {
        return res.json(todos)
    }
    const completed = req.query.completed === 'true'
    res.json(todos.filter(todo => todo.completed === completed))
})

// 全クライアントに対するSSE送信関数を保持する配列
let sseSenders = []
let sseId = 1

// TODO一覧の取得
app.get('/api/todos/events', (req, res, next) => {
    // タイムアウトの抑止
    req.socket.setTimeout(0)
    // req.socket.setTimeout(30000)  // 10秒で接続を切る
    res.set({
        // Content-TypeでSSEで有ることを示す
        'Content-Type': 'text/event-stream'
    })
    // クライアントにSSE送信する関数を作成して登録
    const send = (id, data) => res.write(`id:${id}\ndata:${data}\n\n`)
    sseSenders.push(send)
    // リクエスト発生時点での状態を送信
    send(sseId, JSON.stringify(todos))
    // リクエストがクローズされたらレスポンスを終了してSSE送信関数を配列から削除
    req.on('close', () => {
        res.end()
        sseSenders = sseSenders.filter(_send => _send !== send)
    })
})
/** TODOの更新に伴い全クライアントに対してSSEを送信する */
function onUpdateTodos() {
    sseId += 1
    const data = JSON.stringify(todos)
    sseSenders.forEach(send => send(sseId, data))
}
// TODOの新規登録
let id = 2
app.post('/api/todos', (req, res, next) => {
    const { title } = req.body;
    if (typeof title !== 'string' || !title) {
        const err = new Error('タイトルは必須です')
        err.statusCode = 400;
    }
    // TODOの作成
    const todo = { id: id += 1, title, completed: false }
    todos.push(todo)
    res.status(201).json(todo)  // createdは201
    onUpdateTodos()
})

app.use('/api/todos/:id(\\d+)', (req, res, next) => {
    const targetID = Number(req.params.id)
    const todo = todos.find(todo => todo.id === targetID)
    if (!todo) {
        const err = new Error('見つかりません')
        err.statusCode = 404
        return next(err)
    }
    req.todo = todo;
    console.log(req.todo)
    next()
})
app.route('/api/todos/:id(\\d+)/completed')
    .put((req, res, next) => {
        req.todo.completed = !(req.todo.completed);
        res.status(200).json(req.todo)
    })
app.route('/api/todos/:id(\\d+)')
    .delete((req, res, next) => {
        const todo = todos.filter(todo => req.todo.id !== todo.id)
        console.log(todo)
        // res.status(200).json(todo) // データを返すなら200
        res.status(204).end() // データを返さないなら204
    })


// エラーハンドリミドルウェア
app.use((err, req, res, next) => {
    console.log(err)
    console.log(err)
    res.status(err.statusCode || 500).json({ error: err.message })
})

app.listen(3004)

fetch('http://localhost:3004/api/todos/1',
    {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
    }
)
    .then((response) => {
        console.log(response.status)
        return response.json()
    })
    .then((data) => console.log(data))
    .catch((err) => console.log(err))

/** nect.jsを使ったユニバーサルwebアプリケーションの例 */
const next = require('next')
const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })

nextApp.prepare().then(
    // pagesディレクトリ内の各Reactコンポーネントに対するサーバサイドルーティング
    () => app.get('*', nextApp.getRequestHandler()),
    err => {
        console.error(err)
        process.exit(1)
    }
)
// await fetch('http://localhost:3004/api/todos', {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ title: 'ペン' })
// }) 