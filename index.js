const express = require("express");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5002;
console.log(process.env.PORT);

app.get("/", (req, res, next) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`listen ${port}`);
})


