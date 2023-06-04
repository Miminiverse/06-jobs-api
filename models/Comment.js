const mongoose = require('mongoose')



const CommentSchema = new mongoose.Schema({
    username: {
        type: String
    },
    content: {
        type: String, 
        trim: true,
    }
});

module.exports = mongoose.model('Comment', CommentSchema)