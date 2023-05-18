
const express = require('express');
const router = express.Router()

const {    
    getAllTodos, 
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todos')


router.route("/").post(createTodo).get(getAllTodos)
router.route("/:id").get(getTodo).delete(deleteTodo).patch(updateTodo)


module.exports = router