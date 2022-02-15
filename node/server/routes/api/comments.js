const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const comments = require('../../../models/comments');
const checkAuth = require('../../middleware/checkauth');
const router = express.Router();





router.post('/add', async (req, res) => { 
    try{
    await comments.updateOne(
        { postID: req.body.postID },
        { 
            $set:{
                postID: req.body.postID
            },  
            $push:{
            comments: {
                body: req.body.comment,
                creator: req.body.creator,
                createdAt: new Date()
            } 
            }
        },
        {upsert: true}  
    )
    res.send("done");
    }catch(e){
        res.send({message: "Something went wrong"});
    }
})

router.get('/get/:postID', async (req,res) => {
    try{
        res.send(await comments.find({postID: req.params.postID}));
    }catch(e){
        res.send({message: "Something went wrong"});
    }
})

router.post('/dellcomm', async (req,res) =>{
    try{
    await comments.updateOne({_id: new mongodb.ObjectID(req.body.id)}, {$pull: { comments: {_id: new mongodb.ObjectID(req.body.commid)} }})
    res.status(200).send();
    }catch(e){
        res.send({message: "Something went wrong"});
    }
});

module.exports = router;