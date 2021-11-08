const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());

app.use(cors());

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

const accounts = require('./routes/api/accounts');

app.use('/api/accounts', accounts);

app.listen(3000);