const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({

    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true}


});


module.exports.Test = mongoose.model('Register', RegisterSchema);