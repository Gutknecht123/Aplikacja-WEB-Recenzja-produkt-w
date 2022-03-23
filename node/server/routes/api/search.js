const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');
const checkAuth = require('../../middleware/checkauth');
const router = express.Router();
var sanitize = require('mongo-sanitize');

//search by category
router.get('/category/:phrase', async (req, res) => {
    try{
    var phrase = sanitize(req.params.phrase);
    var category = sanitize(req.query["category"]);
    let reg = new RegExp(phrase, "ig");
    res.send(await posts.find({ title: reg, category: category }).sort({createdAt: -1}).limit(parseInt(req.query["PostCount"])));
    }catch(e){
        res.send({message: "Something went wrong"});
    }
});

//search by title

router.get('/title/:phrase', async (req, res) => {
    try{
    var phrase = sanitize(req.params.phrase);
    let reg = new RegExp(phrase, "ig");
    res.send(await posts.find({ title: reg }).sort({createdAt: -1}).limit(parseInt(req.query["PostCount"])));
    }catch(e){
        res.send({message: "Something went wrong"});
    }
});

//get categories

router.get('/categories/:phrase', async (req, res) => {

    var phrase = sanitize(req.params.phrase);
    let reg = new RegExp(phrase, "ig");

    res.send(await posts.find({ title: reg }, {category: 1, _id: 0}).distinct('category'));

});

//////
  
router.get("/username/:phrase", async (req,res) => {

    const usr = await accounts.find({loginUp: (req.params.phrase).toUpperCase()});

    const {password, ...data} = await usr.toJSON();

    res.send(data);

})

//search by creator

router.get('/creator/:phrase', async (req, res) => {

    res.send(await posts.find({ $text: { $search: req.params.phrase } }));

});

module.exports = router;