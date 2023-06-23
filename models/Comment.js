const mongoose = require('mongoose')



const CommentSchema = new mongoose.Schema({
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OTodo",

    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OAuthUser"
    },
    content: {
        type: String, 
        trim: true,
    }, 
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
    }
  
});

module.exports = mongoose.model('Comment', CommentSchema)