const mongoose = require('mongoose');

const FollowsSchema = new mongoose.Schema({

    Username: { type: String },
    Follows: [{

        Follow: { type: String  },
        createdAt: { type: Date }

    }],
    Followings: [{

        Following: { type: String },
        createdAt: { type: Date }

    }]

});



module.exports = mongoose.model('follows', FollowsSchema);