const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const app = express();

//middleware 
app.use(cors());
app.use(express.json());

//test route 

app.get('/', (req, res) => {
    res.send('Student Employment Portal Backend Running...');
});

module.exports = app;