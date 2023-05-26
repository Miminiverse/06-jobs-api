const mongoose = require('mongoose')

const OTodoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
        required: [true, 'PLease provide a content']
    },
    pic: {
        type: String,
        default: "https://jwt.io/img/pic_logo.svg"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'OAuthUser',
        required: [true, 'Please provide a user']
    }
}, {timestamps: true})

module.exports = mongoose.model('OTodo', OTodoSchema)