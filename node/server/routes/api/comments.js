const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const comments = require('../../../models/comments');

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
                likes: 0,
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
   

    

        
    /*
    const comment = new comments({

        postID: req.body.postID,
        comments:{
            body: req.body.comment
        }

    });

    const result = await comment.save();

    const data = result.toJSON();

    res.send(data);


    */

})

router.get('/get/:postID', async (req,res) => {

    res.send(await comments.find({postID: req.params.postID}));
    

})

router.delete('/:id', async (req,res) =>{

    await comments.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();

});

module.exports = router;