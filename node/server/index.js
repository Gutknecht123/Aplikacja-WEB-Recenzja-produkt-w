const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
//const fileUpload = require('express-fileupload');
const multer = require('multer');
//const expressBusboy = require('express-busboy');

//Database

const mongoose = require('mongoose');
try{
    mongoose.connect("mongodb+srv://user:12345@cluster0.rorub.mongodb.net/mongodb?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () => {
        console.log("Connected");
    });
}
catch (error) {
    handleError(error);
}

//////////////////////////

//Config

const app = express();

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors({
    credentials: true,
    origin: "http://localhost:8080"
}));

//app.use(express.static('/run/desktop/mnt/host/c/Users/Robert/Desktop/Praca/node/server/public/upload'));

app.use(express.static('/upload/'));

//app.use(fileUpload());

//app.use('./public', express.static('public'));

app.use(express.static(__dirname));

app.use(cookieParser())

///////////////////////////

//Routes

const DIR = './public';

/*
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(req.body);
      cb(null, DIR)
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })
*/

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,  './server/public/upload/');
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
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

const posts = require('./routes/api/posts');

app.use('/api/posts',  posts);

const accounts = require('./routes/api/accounts');

app.use('/api/accounts', accounts);

const comments = require('./routes/api/comments');

app.use('/api/comments', comments);

const search = require('./routes/api/search');

app.use('/api/search', search);



app.get("/api/upload", (req, res) => {
    res.render("upload")
})

app.post("/api/upload", upload.array('files', 5), (req,res) => {

    console.log(req.body);
    console.log(req.files);
    //for(var i = 0; i<req.files.length; i++){
    //console.log(req.files[i].filename);
   // }
    res.send("Uploaded")


})

app.listen(3000);