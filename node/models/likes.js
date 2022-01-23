const mongoose = require('mongoose');


const LikesSchema = new mongoose.Schema({

    Username: { type: String },

});

module.exports = mongoose.model('likes', LikesSchema);