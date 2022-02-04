const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');

const router = express.Router();

// search by category
router.get('/category/:phrase', async (req, res) => {

    res.send(await posts.find({ $text: { $search: req.params.phrase } }));

});


//search by creator

router.get('/creator/:phrase', async (req, res) => {

    res.send(await posts.find({ $text: { $search: req.params.phrase } }));

});

//search in text?

router.get('/content/:phrase', async (req, res) => {

    res.send(await posts.find({ $text: { $search: req.params.phrase } }));

});

router.get("/username/:phrase", async (req,res) => {

    const usr = await accounts.find({loginUp: (req.params.phrase).toUpperCase()});

    const {password, ...data} = await usr.toJSON();

    res.send(data);

})

module.exports = router;