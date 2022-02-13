const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');

const router = express.Router();

//search by category
router.get('/category/:phrase', async (req, res) => {

    let reg = new RegExp(req.params.phrase, "ig");
    console.log(req.params.phrase);
    console.log(req.query["category"]);
    res.send(await posts.find({ title: reg, category: req.query["category"] }).sort({createdAt: -1}).limit(parseInt(req.query["PostCount"])));

});


//search by creator

router.get('/creator/:phrase', async (req, res) => {

    res.send(await posts.find({ $text: { $search: req.params.phrase } }));

});

//search by title

router.get('/title/:phrase', async (req, res) => {

    let reg = new RegExp(req.params.phrase, "ig");

    res.send(await posts.find({ title: reg }).sort({createdAt: -1}).limit(parseInt(req.query["PostCount"])));

});

//get categories

router.get('/categories/:phrase', async (req, res) => {

    let reg = new RegExp(req.params.phrase, "ig");

    res.send(await posts.find({ title: reg }, {category: 1, _id: 0}).distinct('category'));

});

router.get("/username/:phrase", async (req,res) => {

    const usr = await accounts.find({loginUp: (req.params.phrase).toUpperCase()});

    const {password, ...data} = await usr.toJSON();

    res.send(data);

})

module.exports = router;