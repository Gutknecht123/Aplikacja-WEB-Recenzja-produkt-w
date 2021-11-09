const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    login: { type: String, required: true, unigue: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unigue: true },
    name: { type: String },
    surname: { tpye: String },
    createdAt: { type: Date }


});


module.exports = mongoose.model('User', UserSchema);