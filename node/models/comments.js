const mongoose = require('mongoose');

const CommentsSchema = new mongoose.Schema({

    postID: { type: String, unique: true },
    comments: [{
        body: {type: String, min: 1, max: 125},
        creator: {type: String},
        likes: {type: Number},
        createdAt: { type: Date }
    }]


});


module.exports = mongoose.model('comments', CommentsSchema);