const Comment = require('../models/Comment')
const OAuthUser = require("../models/OAuthUser")
const OTodo = require('../models/OTodo')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require("../errors")



const createComment = async (req,res) => {


    console.log(req.body)


    const newContent = new Comment(req.body)
    newContent.save((err, comment) => {
        if (err) return res.json(err)

        Comment.find({
            "_id": comment._id
        })
        .populate("username")
        .exec((err, result) => {
            if (err) return res.json(err)
            return res.status(200).json({success: true, result})
        })
    })

}

const getAllComment = async (req,res) => {
    try {
        Comment.find({"todoId": req.body.todoId})
        .populate("username")
        .sort({updatedAt: -1})
        .exec((err, comments) => {
            if (err) return res.json(err)
            res.status(200).json({success: true, comments})
        })

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}




module.exports = { 
    createComment, 
    getAllComment,
    // updateTodo,
    // deleteTodo,

}


