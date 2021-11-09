const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { query } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/accounts", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () =>{
    console.log("Connected");
});

const router = express.Router();

router.post('/register', async (req,res) => {

    
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    
    const user = new User({
        login: req.body.login,
        password: hash,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        createdAt: new Date()
    });

    const result = await user.save();

    const {password, ...data} = result.toJSON();

    res.send(data);

    
});



router.post('/login', async (req, res) => {

    

    const accs = await dbconnect();

    const user = await accs.findOne({login: req.body.login})
    
   


    if(!user){
        return res.status(404).send({
            message: "There is no user with this login!"
        })
    }
    
    
    if(!await bcrypt.compare(req.body.password, user.password)){
        return res.status(400).send({
            message: "Invalid password!"
        })
    }


    const token = jwt.sign({_id: user._id}, "brek");

    res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24*60*60*1000,

    })



    res.send({
        message: "Success!"
    });

});


router.get('/user', async (req,res) => {

    try{
    
    const accs = await dbconnect();

    const cookie = req.cookies['jwt'];

    const claims = jwt.verify(cookie, 'brek');

    if(!claims){
        return res.status(401).send({
            message: "Unauthenticated userxD!"
        })
    }

    const user = await accs.findOne({_id: claims._id});

    const {password, ...data} = await user.toJSON();

    res.send(data);

    }catch(error){
        return res.status(401).send({
             message: "Unauthenticated user!"
        })
}

})


router.post("/logout", async (req,res) =>{

    res.cookie("jwt", '', {
        maxAge: 0
    })

    res.send({
        message: "Successful logout!"
    })
})


async function dbconnect(){

    const client = await mongodb.MongoClient.connect('mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

return client.db('mongodb').collection('accounts');

}


module.exports = router;