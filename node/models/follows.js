const mongoose = require('mongoose');

const FollowsSchema = new mongoose.Schema({

    Username: { type: String, unique: true },
    Follows: [{

        Follow: { type: String, unique: true },
        createdAt: { type: Date }

    }],
    Followings: [{

        Following: { type: String, unique: true },
        createdAt: { type: Date }

    }]

});



module.exports = mongoose.model('follows', FollowsSchema);