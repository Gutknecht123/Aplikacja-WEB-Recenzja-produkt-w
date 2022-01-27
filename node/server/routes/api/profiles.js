const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const posts = require('../../../models/posts');
const profiles = require('../../../models/profiles');
const comments = require('../../../models/comments');
const multer = require('multer');
const fileUpload = require('express-fileupload');
const router = express.Router();
const ObjectID = require('mongodb').ObjectID;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  './server/public/profiles');
    },
    filename: (req, file, cb) => {
        //console.log(req.body.creator);
      const uniqueSuffix = Math.round(Math.random() * 1E9)
      const fileName = req.body.username.toLowerCase().split(' ').join('-') + "-" + uniqueSuffix + "-" + file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });
  
  var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });

  router.post('/update', upload.array('files', 2),async (req,res,next) => {

    var pic1 ='', pic2 = ''

    const url = req.protocol + '://' + req.get('host')

    console.log(req.files)

    if (req.files[0]) {
        pic1 = url + '/api/profiles/upload/' + req.files[0].filename.toLowerCase().split(' ').join('-');

        await profiles.updateOne(
            {Username: req.body.username},
            {
                $set:{
                  Username: req.body.username,
                  profilePic: pic1
                }
            },
            {upsert: true}
        );
        
        }
    if (req.files[1]) {

        pic2 = url + '/api/profiles/upload/' + req.files[1].filename.toLowerCase().split(' ').join('-');

        await profiles.updateOne(
            {Username: req.body.username},
            {
                $set:{
                  Username: req.body.username,
                  banner: pic2
                }
            },
            {upsert: true}
        );
    
    }
    
    console.log(pic1)
    console.log(pic2)

    res.send("done");


  });

  router.get("/upload/:image", (req, res, next) => {

    path = require('path')
    //const url = req.protocol + '://' + req.get('host');
    const image = req.params.image;
    console.log(path.join(__dirname, '../../public/profiles/' + image));
    res.sendFile(path.join(__dirname, '../../public/profiles/' + image));


    });

    router.get('/get/:user', async (req, res) => {

        res.send(await profiles.find({Username: req.params.user}));
    
    });


module.exports = router;