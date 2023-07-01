
const express = require('express');
const router = express.Router()

const {    
    getAllOTodos, 
    // getTodo,
    createOTodo,
    // updateTodo,
    // deleteTodo
} = require('../controllers/Otodos')


router.route("/").post(createOTodo).get(getAllOTodos)
// router.route("/:id").get(getTodo).delete(deleteTodo).patch(updateTodo)


module.exports = router