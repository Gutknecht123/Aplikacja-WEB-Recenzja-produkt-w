const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const follows = require('../../../models/follows');


const router = express.Router();


//add to follows
router.post('/add', async (req, res) => {

    try{

        await follows.updateOne(
            { Username: req.body.user },
    
            { 
                $push:{
                Followings: {
                    Following: req.body.followuser,
                    createdAt: new Date()
                }
                }
            },
    
            {upsert: true}
            
        )

        await follows.updateOne(
            { Username: req.body.followuser },
    
            { 
                $push:{
                Follows: {
                    Follow: req.body.user,
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

//get followers / followings

router.get('/getfollows/:user', async(req,res) => {

    res.send(await follows.find({Username: req.params.user}));

})


//delete unfollow

router.post('/unfollow/:user', async (req,res) =>{

    await follows.updateOne({Username: req.params.user}, {$pull: { Followings: {Following: req.body.followuser} }})
    await follows.updateOne({Username: req.body.followuser}, {$pull: { Follows: {Follow: req.params.user} }})
    res.status(200).send();

});




module.exports = router;