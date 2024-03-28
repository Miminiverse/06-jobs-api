const mongoose = require('mongoose')

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'published'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }
}, {timestamps: true})

module.exports = mongoose.model('Todo', TodoSchema)