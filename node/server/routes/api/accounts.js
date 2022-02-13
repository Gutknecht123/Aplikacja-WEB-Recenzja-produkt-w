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
const ObjectID = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
const profiles = require('../../../models/profiles');

const router = express.Router();
//ustawienia wysyłania emaili
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'roburr24@gmail.com',
      pass: 'kolo2424'
    }
  });

//rejestracja
router.post('/register', async (req,res) => {

    const saltRounds = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const code = req.body.login + crypto.randomBytes(20).toString('hex');

    try{

    const user = new accounts({
        login: req.body.login,
        loginUp: req.body.loginUp,
        password: hash,
        email: req.body.email,
        active: false,
        createdAt: new Date()
    });

    const result = await user.save();

    const {password, ...data} = await result.toJSON();

    var link = 'http://192.168.1.12:3000/api/accounts/verify/'+code;

    //Opcje maila
    var mailOptions = {
        from: 'roburr24@gmail.com',
        to: req.body.email,
        subject: 'Vue app Verification',
        text: 'Verify your account, click the link: ' + link,
    
      };

    const ver = new verify({

        userID: data._id,
        code: code

    })

    await ver.save();

    //Wysłanie maila z linkiem weryfikacyjnym
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });


    //Utworzenie followów
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
    
        //Utworzenie profilu
        const profile = new profiles({

            Username: req.body.login,
            profilePic: '',
            banner: '',
            description: ''

        });

        await profile.save();


        res.send("done");

        }catch(e){
            console.log(e);
        }



});

//Obsługa weryfikacji

router.get('/verify/:code', async(req, res) => {

    var ID;

    try{

        await verify.findOne({code: req.params.code}, (err, check) => {

            if(check){

                ID = check._id;
                console.log(req.params.code);
                console.log(check.userID);
    
                accounts.updateOne(
                    {_id: ObjectID(check.userID)},
                    {
                        $set:{
                        active: true
                        }
                    },
                    {upsert: true}, (err, res) => {
                        if (err) throw err;
                    });

            }else{
                res.send(err);
            }

        })

        await verify.deleteOne({code: req.params.code}, (err, obj ) => {
            if (err) throw err;
          });
                    
        res.writeHead(302, {
            'Location': 'http://192.168.1.12:8080/#/login'
        })
        res.end();

    }catch(e){
        console.log(e);
    }

})


//Logowanie
router.post('/login', async (req, res) => {

    if(await accounts.findOne({

        $and: [
            {loginUp: req.body.loginUp},
            {active: true}
        ]
    
    })){

    const user = await accounts.findOne({loginUp: req.body.loginUp})

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
    }else{
        res.send({
            message: "Błędne dane / Konto nieaktywowane!"
        });
    }
});

//get user
router.get('/user', async (req,res) => {

    try{
    
    const cookie = req.cookies['jwt'];

    const claims = jwt.verify(cookie, 'brek');

    if(!claims){
        return res.status(401).send({
            message: "Unauthenticated user!"
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

//Wylogowanie
router.post("/logout", async (req,res) =>{

    res.clearCookie('jwt');

    res.send({
        message: "Successful logout!"
    })
})


//get ustalonego użytkownika
router.get("/username/:user", async (req,res) => {

    const usr = await accounts.findOne({loginUp: (req.params.user).toUpperCase()});

    res.send(usr);

})


module.exports = router;