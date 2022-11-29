const express = require("express");
const app = express();
const port = 3003;

// app.use(express.json);
// app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Hello World");
})


app.listen(port, () => {
    console.log(`${port}で接続しました`);
})

const members = [
    { id: 1, name: "やまだ" },
    { id: 2, name: "いとう" },
    { id: 3, name: "たなか" },
    { id: 4, name: "さとう" },
    { id: 5, name: "すずき" }
];

// apiサーバを定義
app.get("/api/members", (req, res) => {
    res.send(members);
})
