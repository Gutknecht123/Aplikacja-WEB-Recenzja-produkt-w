const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');

/*
const mongoose = require('mongoose');
const Register = require('./models/RegisterSchema');

mongoose.connect('mongodb://localhost:27017/accounts');

var db = mongoose.connect('mongodb://localhost:27017/accounts');

db.on('error', console.error.bind(console, 'CONNECTION ERROR'));

db.once('open', function(){
    console.log('Connected');
});

const router = express.Router();


router.post('/', async (req,res) => {

    const record = req.body;

    console.log(record);

    await Register.create(record);

    res.status(201).send();


});
*/
const router = express.Router();

router.get('/', async (req, res) => {

    const posts = await dbconnect();
    res.send(await posts.find({}).toArray());

});


router.post('/', async (req,res) => {

    const posts = await dbconnect();
    await posts.insertOne({
        login: req.body.login,
        password: req.body.password,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        createdAt: new Date()
    });
    res.status(201).send();

});


async function dbconnect(){

    const client = await mongodb.MongoClient.connect('mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

return client.db('mongodb').collection('accounts');

}

module.exports = router;