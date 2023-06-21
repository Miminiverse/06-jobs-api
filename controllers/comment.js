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
        }
    )

}

const getAllComment = async (req,res) => {
    try {
        const todo = await OTodo.findById(req.params.id).populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } }, 
            select: 'content username _id replies'
          });
        if(!todo) {
            return res.status(404).json({ error: 'Post not found' });
        }
        const comments = todo.comments.map((comment) => 
        ({
            content: comment.content,
            username: comment.username,
            _id: comment._id,
            replies: comment.replies,
        }))
        res.status(200).json(comments)

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



const createReply = async (req,res) => {
    console.log(req.params)
    console.log(req.body)
    console.log(req.user.username)


    const comment_id = req.params.commentId
    try {
        if (comment_id) {
            const reply = {
                commentId: comment_id,
                username: req.user.username,
                reply: req.body.reply,
            }
            const newComment = await Comment.findByIdAndUpdate(
                {
                _id: comment_id
            }, {
                $push: {replies: reply}
            }, {
                new: true
            }
            )
            console.log(newComment)
            res.json(newComment)
        }

    } catch (err) {
        res.status(400).json({ error: err.message });
    }

}


const getCommentTemp = (req,res) =>{
res.json([
    {
    id: 1,
    user: "Tam",
    content: "Hello",
    parentComment: null,
    hasResponse: true,
    
    //query for all comments where parent is null
}, 

])
}

// Clients provide a commentID, backend returns all of the response (responses are child comments)

const getChildrenComment = (req,res) => {
    if(req.params.id === 1){
        res.json([
            {
                id: 2,
                user: "Jack",
                content: "Sky smoky",
                parentComment: 1,

            },    {
                id: 3,
                user: "Carlos",
                content: "Hey hey",
                parentComment: 1,
                hasResponse: true,
            }
        ])
        return
    }
    
    if (req.params === 3 ) {
        res.json([
            {
                id: 4,
                user: "Carlos111",
                content: "Alolo",
                parentComment: 3
            }
        ])
        return
    }
    res.status(404).send()
    
}

module.exports = { 
    createComment, 
    createReply,
    getAllComment,
    // updateTodo,
    // deleteTodo,
    getCommentTemp,
    getChildrenComment,
}


