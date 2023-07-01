const mongoose = require('mongoose')



const CommentSchema = new mongoose.Schema({
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OTodo",

    },
    username: {
        type: String
    },
    content: {
        type: String, 
        trim: true,
    }, 
    replies: [{
        username: {
            type: String
        },
        commentId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true
        }, 
        reply: {
            type: String, 
            required: true
        }, 
        createdAt: {
            type: Date,
            default: new Date().getTime()
        }
    }]

});

module.exports = mongoose.model('Comment', CommentSchema)