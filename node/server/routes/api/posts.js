const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const router = express.Router();



//getposts

router.get('/', async (req, res) => {

    res.send(await posts.find({}));

});


//addposts

router.post('/add-post', async (req,res,next) => {

  //console.log(req.body);
  //console.log(req.files);
  //console.log(req.files.length);
  
    
    if (!req.files) {
        res.send("File was not found");
        return;
    }

    const reqFiles = []

    const url = req.protocol + '://' + req.get('host')

    for (var i = 0; i < req.files.length; i++) {
      reqFiles.push(req.files.files[i].name);
    }
     
    
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
        files: reqFiles,
        media: '',
        stars: req.body.stars,
        creator: req.body.creator,
        createdAt: new Date()

    });



   

    const result = await post.save().then(result => {
        console.log(result);
        res.status(201).json({
          message: "Done upload!"
        })
      }).catch(err => {
        console.log(err),
          res.status(500).json({
            error: err
          });
      });

});

//files
/*
router.post('/file-upload', upload.array('files', 10),async (req,res,next) => {


  











    
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }

    var files = [];
    var fileKeys = Object.keys(req.files);

    fileKeys.forEach(function(key) {
        files.push(req.files[key]);
    });

    console.log(files[0].name);
    console.log(files[0].size);

        
    for( var i = 0; i<files.length; i++){

    const myFile = files[i];

    
    fs.writeFile(`C:/Users/Robert/Desktop/Praca/node/server/routes/api/public/${myFile.name}`, myFile, 'binary', function(err){
        if (err) throw err
        console.log('File saved.')
    });
    */
    
    /*
    myFile.mv(`${__dirname}/public/${myFile.name}`, (err) => {
        if(err){
            console.log(err);
            return res.status(500).send({ msg: "Error occured" });
        }
        console.log({name: myFile.name, path: `${__dirname}/public/${myFile.name}`});
        return res.send({name: myFile.name, path: `/${myFile.name}`});
        
    });
    
    }
    
});
*/
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