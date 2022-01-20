const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const router = express.Router();



//getposts - global

router.get('/', async (req, res) => {

    res.send(await posts.find({}));

});

//getposts - own

router.get('/get/:user', async (req, res) => {

    res.send(await posts.find({creator: req.params.user}));

});

//getposts - followings

router.get('/get/followings', async (req, res) => {

  res.send(await posts.find({creator: req.body.followinguser}));

});

//addposts

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  './server/public/upload');
    },
    filename: (req, file, cb) => {
        //console.log(req.body.creator);
      const uniqueSuffix = Math.round(Math.random() * 1E9)
      const fileName = req.body.creator.toLowerCase().split(' ').join('-') + "-" + uniqueSuffix + "-" + file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });


router.post('/add-post', upload.array('files', 5),async (req,res,next) => {

  //console.log(req.body);
  //console.log(req.files);
  //console.log(req.files.length);
  console.log(__dirname);
    
    if (!req.files) {
        res.send("File was not found");
        return;
    }

    const reqFiles = []

    const url = req.protocol + '://' + req.get('host')

    for (var i = 0; i < req.files.length; i++) {
      
      reqFiles.push(url + '/api/posts/upload/' + req.files[i].filename.toLowerCase().split(' ').join('-'));
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

//delposts

router.delete('/:id', async (req,res) =>{
    await posts.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});

router.get("/upload/:image", (req, res, next) => {

    path = require('path')
    //const url = req.protocol + '://' + req.get('host');
    const image = req.params.image;
    console.log(path.join(__dirname, '../../public/upload/' + image));
    res.sendFile(path.join(__dirname, '../../public/upload/' + image));


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