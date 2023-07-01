
const express = require('express');
const router = express.Router()

const {    
    createComment, 
    getAllComment,
    createReply,
    getCommentTemp,
    getChildrenComment,
} = require('../controllers/comment')


router.route("/create/:id/:userId").post(createComment)
router.route("/:id").get(getAllComment)
router.route("/:commentId/reply").post(createReply)
router.route("/getCommentTemp").get(getCommentTemp)
router.route("/getCommentTemp/:id").get(getChildrenComment)
// router.route("/:id").get(getTodo).delete(deleteTodo).patch(updateTodo)


module.exports = router