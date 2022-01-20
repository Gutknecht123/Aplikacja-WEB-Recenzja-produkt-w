const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { query } = require('express');
const jwt = require('jsonwebtoken');
const accounts = require('../../../models/accounts');
const follows = require('../../../models/follows');
const verify = require('../../../models/verification');
const crypto = require("crypto");


const router = express.Router();

router.post('/register', async (req,res) => {

    
    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const code = crypto.randomBytes(20).toString('hex');

    
    try{

    const user = new accounts({
        login: req.body.login,
        loginUp: req.body.loginUp,
        password: hash,
        email: req.body.email,
        name: req.body.name,
        surname: req.body.surname,
        active: false,
        createdAt: new Date()
    });

    const result = await user.save();

    const {password, ...data} = await result.toJSON();

    console.log(data._id);


    const ver = new verify({

        userID: data._id,
        code: code

    })

        await follows.updateOne(
            { Username: req.body.login },
    
            { 
                $set:{
                    Username: req.body.login
                },  
                $push:{
                Follows: {
                    Follow: '',
                    createdAt: new Date()
                },
                Followings: {
                    Following: '',
                    createdAt: new Date()
                }
                }
            },
    
            {upsert: true}
            
        )
    
        res.send("done");
        }catch(e){
            console.log(e);
        }



    
});



router.post('/login', async (req, res) => {

    
    const user = await accounts.findOne({loginUp: req.body.loginUp}) // toUpercase
    // Kopia loginu uppercase w mongo i później porównanie z loginem podanym uppercase

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
    
    const cookie = req.cookies['jwt'];

    const claims = jwt.verify(cookie, 'brek');

    if(!claims){
        return res.status(401).send({
            message: "Unauthenticated userxD!"
        })
    }

    const user = await accounts.findOne({_id: claims._id});

    const {password, ...data} = await user.toJSON();

    res.send(data);

    }catch(error){
        return res.status(401).send({
             message: "Unauthenticated user!"
        })
}

})


router.post("/logout", async (req,res) =>{

    res.clearCookie('jwt');

    res.send({
        message: "Successful logout!"
    })
})

router.get("/username/:user", async (req,res) => {



    const usr = await accounts.findOne({loginUp: (req.params.user).toUpperCase()});

    res.send(usr);

})
/*
async function dbconnect(){

    const client = await mongodb.MongoClient.connect('mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

return client.db('mongodb').collection('accounts');

}
*/

module.exports = router;