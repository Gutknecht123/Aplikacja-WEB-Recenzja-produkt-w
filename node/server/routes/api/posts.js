const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const posts = require('../../../models/posts');
const likes = require('../../../models/likes');
const comments = require('../../../models/comments');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;


//like post

router.post('/like/:postid', async(req,res) => {

  console.log(req.params.postid);

  try{

   posts.updateOne(
      { _id: ObjectID(req.params.postid) },
      
      {
        $inc: {
            likes: 1
        },
        $push:{
          likedby:{
              username: req.body.username,
              createdAt: new Date()
          }
        }
      },
      {upsert: true}, (err, res) => {
        if (err) throw err;
      })

    likes.updateOne(
        { Username: req.body.username },

        { 
      
            $push:{
            likedPosts: {
                postID: req.params.postid,
                createdAt: new Date()
            }
            }
        }, 

        {upsert: true},(err, res) => {
          if (err) throw err;
        }
        
    )

      res.send("done");
    
  }catch(e){
      console.log(e);
  }


})



//dislike post
router.post('/dislike/:postid', async(req,res) => {

  await posts.updateOne(
    { _id: ObjectID(req.params.postid) },
    
    {
      $pull: {
        likedby: {username: req.body.username}
      }
    }

  )

  await likes.updateOne({Username: req.body.username}, {$pull: { likedPosts: {postID: req.params.postid} }})
  
  res.status(200).send();

})

//get likes

router.get('/likes/:postid', async(req, res) => {

  res.send(await posts.find({ _id: ObjectID(req.params.postid) }, {likedby: 1, _id: 0}).distinct('likedby'));

})



//getposts - global

router.get('/', async (req, res) => {

    res.send(await posts.find({}).sort({createdAt: -1}).limit(parseInt(req.query.PostCount)));

});

//getposts - own

router.get('/get/:user', async (req, res) => {

    res.send(await posts.find({creator: req.params.user}).sort({createdAt: -1}).limit(parseInt(req.query.PostCount)));

});

//getposts - followings

router.get('/followings', async (req, res) => {

  var arr = [];

  //console.log(req.query["follows"]);

  console.log('xD');

  var p = [];
   
  

  for(var i=0; i<req.query["follows"].length; i++){

    arr = JSON.parse(req.query["follows"][i]);

    console.log("TO ARR:");
    console.log(arr.Following);

    p.push({"creator": arr.Following});

  }

  
  console.log(p);

  res.send(await posts.find({$or: p}).sort({createdAt: -1}).limit(parseInt(req.query.PostCount)));

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
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif" || file.mimetype == "video/mp4") {
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

        title: req.body.title,
        text: req.body.text,
        category: req.body.category,
        likedby: [{
          username: '',
          createdAt: new Date()
        }],
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

//edit post

router.post('/editpost/:postid', upload.array('files', 5), async(req,res) => {

  try{

    const reqFiles = []

    const url = req.protocol + '://' + req.get('host')

    for (var i = 0; i < req.files.length; i++) {
      
      reqFiles.push(url + '/api/posts/upload/' + req.files[i].filename.toLowerCase().split(' ').join('-'));
    }

    if(req.files[0]){
      posts.updateOne(
        { _id: ObjectID(req.params.postid) },
        
        {
          $set: {
          
           files: reqFiles,
           title: req.body.title,
           text: req.body.text,
           category: req.body.category,
           stars: req.body.stars
 
          }
        },
        (err, res) => {
          if (err) throw err;
        })
    }else{
    posts.updateOne(
       { _id: ObjectID(req.params.postid) },
       
       {
         $set: {

          title: req.body.title,
          text: req.body.text,
          category: req.body.category,
          stars: req.body.stars

         }
       },
       (err, res) => {
         if (err) throw err;
       })
    }




      res.status(201).json({
        message: "Done upload!"
      })
    }catch(e){
        console.log(e);
    }

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