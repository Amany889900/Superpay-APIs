const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: Number,
            required: true
        }
    }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;