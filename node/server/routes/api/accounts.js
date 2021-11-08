const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { query } = require('express');

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

router.post('/register', async (req,res) => {

    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    
    const posts = await dbconnect();

    await posts.insertOne({
        login: req.body.login,
        password: hash,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        createdAt: new Date()
    });
    res.status(201).send();

    
});

//getacc

router.post('/login', async (req, res) => {



    const accs = await dbconnect();
    const login = req.query.login;
    //const password = req.query.password; 

    

    res.send(await accs.find({login}).toArray());

});


async function dbconnect(){

    const client = await mongodb.MongoClient.connect('mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

return client.db('mongodb').collection('accounts');

}

module.exports = router;