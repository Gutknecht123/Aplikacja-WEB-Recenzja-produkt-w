const mongoose = require('mongoose');


const LikesSchema = new mongoose.Schema({

    Username: { type: String },
    likedPosts: [{
        postID: {type: String},
        createdAt: {type: Date}
    }]

});

module.exports = mongoose.model('likes', LikesSchema);