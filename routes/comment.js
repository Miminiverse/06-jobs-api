
const express = require('express');
const router = express.Router()

const {    
    createComment, 
    getAllComment,
} = require('../controllers/comment')


router.route("/create/:id/:userId").post(createComment)
router.route("/:id").get(getAllComment)
// router.route("/:id").get(getTodo).delete(deleteTodo).patch(updateTodo)


module.exports = router