const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const mongoose = require('mongoose');
try{
    mongoose.connect("mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log("Connected");
    });
}
catch (error) {
    handleError(error);
}

const app = express();



app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
  }));

app.use(cors({
    credentials: true,
    origin: "http://localhost:8080"
}));

app.use(express.static('public'));

app.use(fileUpload());

app.use('/public', express.static('public'));

app.use(cookieParser())

const posts = require('./routes/api/posts');

app.use('/api/posts', posts);

const accounts = require('./routes/api/accounts');

app.use('/api/accounts', accounts);

const comments = require('./routes/api/comments');

app.use('/api/comments', comments);

const search = require('./routes/api/search');

app.use('/api/search', search);

app.listen(3000);