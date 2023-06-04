const Comment = require('../models/Comment')
const OAuthUser = require("../models/OAuthUser")
const OTodo = require('../models/OTodo')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require("../errors")



const createComment = async (req,res) => {

    const {id, userId} = req.params
    const {content} = req.body
    const user = await OAuthUser.findById(userId)

    const newContent = new Comment({
        content, 
        username: req.user.username
    })
    newContent.save()
    .then(() => res.json("Comment Added"));
    OTodo.findByIdAndUpdate(
        {_id: id},
        { $push: { comments: newContent}},
        (err, data) => {
            if(err) {
                res.status(400).json("error: " + err)
            } 
            console.log(data);
        }
    )

}

const getAllComment = async (req,res) => {
    try {
        const todo = await OTodo.findById(req.params.id).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } } // Sort comments by createdAt field in descending order
          });
        if(!todo) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const comments = todo.comments.map((comment) => comment.content)
        res.status(200).json(comments)

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}


module.exports = { 
    createComment, 
    // getTodo,
    getAllComment,
    // updateTodo,
    // deleteTodo
}