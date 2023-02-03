require('isomorphic-fetch')
const express = require('express')
const app = express()

const todos = [
    { id: 1, title: 'ネーム', completed: false },
    { id: 2, title: '下書き', completed: true }
]

app.use(express.json())

app.get('/api/todos', (req, res, next) => {
    console.log(req.query.completed)
    if (!req.query.completed) {
        return res.json(todos)
    }
    const completed = req.query.completed === 'true'
    res.json(todos.filter(todo => todo.completed === completed))
})

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

// app.put('/api/todos/:id/completed', (req, res, next) => {
//     const id = parseInt(req.params.id);
//     const todo = todos.filter(todo => {
//         return todo.id === id
//     })
//     if (!todo) {
//         return res.status(404).json({ error: '見つかりません' })
//     }
//     // 更新する
//     todo[0].completed = !(todo[0].completed);
//     res.status(200).json(todo)  // createdは201
// })

// エラーハンドリミドルウェア
app.use((err, req, res, next) => {
    console.log(err)
    console.log(err)
    res.status(err.statusCode || 500).json({ error: err.message })
})

app.listen(3004)

// fetch('http://localhost:3004/api/todos/2/completed',
//     {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ title: 'ペン入れ' })
//     }
// )
//     .then((response) => {
//         console.log(response.status)
//         return response.json()
//     })
//     .then((data) => console.log(data))
//     .catch((err) => console.log(err))

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