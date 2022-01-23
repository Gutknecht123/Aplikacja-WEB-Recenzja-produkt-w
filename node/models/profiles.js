const mongoose = require('mongoose');


const ProfilesSchema = new mongoose.Schema({

    Username: { type: String },
    profilePic: { type: String },
    banner: { type: String }

});

module.exports = mongoose.model('profiles', ProfilesSchema);