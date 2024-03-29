const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({

    title: {type: String, required: true},
    text: {type: String},
    category: {type: String, required: true},
    likedby: [{

        username: { type: String },
        createdAt: { type: Date }

    }],
    files:{
        type: Array
    },
    stars: {type: Number, required: true},
    creator: {type: String, required: true},
    createdAt: { type: Date }

});


module.exports = mongoose.model('posts', PostsSchema);