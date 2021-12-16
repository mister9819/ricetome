const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already taken']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    gid: {
        type: String,
        required: [true, 'GID is required']
    }
}, {timestamps: true});

const User = mongoose.model('user', userSchema);

module.exports = User;