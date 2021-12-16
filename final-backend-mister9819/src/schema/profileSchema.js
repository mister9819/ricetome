const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already used']
    },
    headline: {
        type: String,
        required: [true, 'Headline is required']
    },
    dob: {
        type: Date,
        required: [true, 'DOB is required']
    },
    zipcode: {
        type: Number,
        required: [true, 'Zipcode is required']
    },
    following: {
        type: Array,
        required: [true, 'Following is required']
    },
    avatar: {
        type: Object,
        required: [true, 'Avatar is required']
    }
}, {timestamps: true});

const Profile = mongoose.model('profile', profileSchema);

module.exports = Profile;