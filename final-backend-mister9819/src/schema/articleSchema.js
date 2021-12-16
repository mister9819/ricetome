const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
}, {timestamps: true})

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    text: {
        type: String,
        required: [true, 'Text is required']
    },
    comments: {
        type: [ commentSchema ],
        required: [true, 'Comments is required']
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    }
}, {timestamps: true});

const Article = mongoose.model('article', articleSchema);

module.exports = Article;
