const mongoose = require('mongoose');

const AccountsSchema = new mongoose.Schema({

    login: { type: String, required: true, unique: true },
    loginUp: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    active: { type: Boolean },
    role: { type: String },
    createdAt: { type: Date }


});


module.exports = mongoose.model('accounts', AccountsSchema);