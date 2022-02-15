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
const request = require("request");
const router = express.Router();
require('dotenv').config();
const checkAuth = require('../../middleware/checkauth');
//ustawienia wysyłania emaili
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
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
        from: process.env.EMAIL,
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
            res.send({message: "Something went wrong"});
        }

});

//Obsługa weryfikacji

router.get('/verify/:code', async(req, res) => {
    try{
        await verify.findOne({code: req.params.code}, (err, check) => {
            if(check){
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

    let reg = new RegExp(req.body.login, "ig");

    if(await accounts.findOne({

        $and: [
            {login: reg},
            {active: true}
        ]
    
    })){
    const user = await accounts.findOne({login: reg})
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
    const token = jwt.sign({_id: user._id}, 
        process.env.JWT,
        {
            expiresIn: "1h"
        }
        );
        res.status(200).json({
            message: 'Succesfull login!',
            login: user.login,
            token: token
        })
    }else{
        res.send({
            message: "Błędne dane / Konto nieaktywowane!"
        });
    }
});

//captcha

router.post('/captcha', async(req,res) => {

    const verifyCaptchaOptions = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        json: true,
        form: {
            secret: process.env.SECRET_CAPTCHA,
            response: req.body.res
        }
    };

    request.post(verifyCaptchaOptions, (err, response, body) => {

        if (err) {
            return res.status(500).json({message: "oops, something went wrong on our side"});
        }
        if (!body.success) {
            return res.status(500).json({message: body["error-codes"].join(".")});
        }

        res.send(body.success)

    })
})

//get user
router.get('/user', checkAuth, async (req,res) => {

    try{

    console.log(req.query["user"]);

    const user = await accounts.findOne({login: req.query["user"]});

    const {password, ...data} = await user.toJSON();

    res.send(data);

    }catch(error){
        return res.status(401).send({
             message: "Unauthenticated user!"
        })
}

})

//Sprawdz czy jest w bazie
router.get("/checklogin", async (req,res) => {

    const result = await accounts.findOne({loginUp: req.query['login'].toUpperCase()});
    if(result){
    const {password, ...data} = await result.toJSON();
    res.send(data);
    }

})
router.get("/checkemail", async (req,res) => {

    let reg = new RegExp(req.query['email'], "ig");

    const result = await accounts.findOne({email: reg});
    if(result){
    const {password, ...data} = await result.toJSON();
    res.send(data);
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

    const result =  await accounts.findOne({loginUp: (req.params.user).toUpperCase()});
    if(result){
    const {password,email,active,createdAt,__v, ...data} = await result.toJSON();
    res.send(data);
    }



})

router.get("/users", checkAuth ,async (req,res) => {

    res.send(await accounts.find({}));

   

})

module.exports = router;