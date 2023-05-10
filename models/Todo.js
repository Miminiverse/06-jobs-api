const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
        required: [true, 'PLease provide a content']
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, {timestamps: true})

module.exports = mongoose.model('Todo', TodoSchema)