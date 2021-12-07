const bodyParser = require('body-parser');
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const posts = require('../../../models/posts');
const comments = require('../../../models/comments');

const router = express.Router();

// search by category
router.get('/category/:phrase', async (req, res) => {

    res.send(await posts.find({category: req.params.phrase}));

});


//search by creator

router.get('/creator/:phrase', async (req, res) => {

    res.send(await posts.find({creator: req.params.phrase}));

});

//search in text?

router.get('/content/:phrase', async (req, res) => {

    res.send(await posts.find({text: req.params.phrase}));

});


module.exports = router;