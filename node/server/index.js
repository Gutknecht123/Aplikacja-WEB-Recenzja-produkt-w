const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');


const app = express();

app.use(bodyParser.json());

app.use(cors({
    credentials: true,
    origin: "http://localhost:8080"
}));

app.use(cookieParser())

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

const accounts = require('./routes/api/accounts');

app.use('/api/accounts', accounts);

app.listen(3000);