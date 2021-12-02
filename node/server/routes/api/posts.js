const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');

const router = express.Router();


//getposts

router.get('/', async (req, res) => {

    res.send(await posts.find({}));

});


//addposts

router.post('/', async (req,res) => {

    /*
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }

    const myFile = req.files.file;

    
    myFile.mv(`${__dirname}/public/${myFile.name}`, (err) => {
        if(err){
            console.log(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        return res.send({name: myFile.name, path: `/${myFile.name}`});
    });
    */
   /*
    await posts.insertOne({
        text: req.body.text,
        category: req.body.category,
        likes: req.body.likes,
        //comms: 0,
        media: req.body.media,
        stars: req.body.stars,
        creator: req.body.creator,
        createdAt: new Date()
    });
    */

    const post = new posts({

        text: req.body.text,
        category: req.body.category,
        likes: req.body.likes,
        media: req.body.media,
        stars: req.body.stars,
        creator: req.body.creator,
        createdAt: new Date()

    });



   

    const result = await post.save();

    const {media, ...data} = await result.toJSON();

    res.send(data);

});

//delposts

router.delete('/:id', async (req,res) =>{
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

/*
async function dbconnect(){

    const client = await mongodb.MongoClient.connect('mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

return client.db('mongodb').collection('posts');

}
*/
module.exports = router;