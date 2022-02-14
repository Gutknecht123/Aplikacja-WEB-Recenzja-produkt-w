const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const multer = require('multer');


//Database

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

//////////////////////////

//Config

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
    credentials: true,
    origin: ["http://localhost:8080", "http://192.168.1.12:8080", "https://www.google.com"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'PUT', 'POST', 'DELETE']
}));

app.use(cookieParser())

///////////////////////////

//Routes

const DIR = './public';

app.use('/api/upload', express.static('./public/upload/'));

app.use(express.static(path.join(__dirname, '/public/upload/')));

const posts = require('./routes/api/posts');

app.use('/api/posts',  posts);

const accounts = require('./routes/api/accounts');

app.use('/api/accounts', accounts);

const comments = require('./routes/api/comments');

app.use('/api/comments', comments);

const search = require('./routes/api/search');

app.use('/api/search', search);

const follows = require('./routes/api/follows');

app.use('/api/follows', follows);

const profiles = require('./routes/api/profiles');

app.use('/api/profiles', profiles);

app.listen(3000, '0.0.0.0');