'use strict'

const express = require('express');
express().get('/', (req, res) => {
    res.send('Hello World!')
}).listen(process.env.PORT || 3000)