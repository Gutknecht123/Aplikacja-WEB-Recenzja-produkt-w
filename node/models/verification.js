const mongoose = require('mongoose');


const VerifySchema = new mongoose.Schema({

    userID: { type: String, unique: true },
    code: {type: String}

});

module.exports = mongoose.model('verification', VerifySchema);