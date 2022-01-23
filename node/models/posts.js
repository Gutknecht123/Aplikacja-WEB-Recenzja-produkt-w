const mongoose = require('mongoose');

const PostsSchema = new mongoose.Schema({
    
    text: {type: String, required: true},
    category: {type: String, required: true},
    likes: {type: Number, required: true},
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