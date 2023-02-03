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

// エラーハンドリミドルウェア
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.statusCode || 500).json({ error: err.message })
})

app.listen(3004)

/** 公式はthenでやってるのでなんか理由ある？ */
fetch('http://localhost:3004/api/todos',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: 'ペン入れ' })
    }
)
    .then((response) => {
        console.log(response.status)
        return response
    })
    .then((response) => response.json())  // json()もpromiseを返す
    .then((data) => console.log(data))
    .then(() => {
        console.log('hi')
        fetch('http://localhost:3004/api/todos')
            .then((response) => response.json())  // json()もpromiseを返す
            .then((data) => console.log(data))
    })


/** 下記は動作しない：TypeError: app.listen(...) is not a function */
// (async () => {
//     const result = await fetch('http://localhost:3004/api/todos')
//     console.log(result.status)
//     const json = await result.json()
//     console.log(json)
// })()

