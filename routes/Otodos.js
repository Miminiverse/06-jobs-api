
const express = require('express');
const router = express.Router()

const {    
    getAllOTodos, 
    getOTodo,
    createOTodo,
    // updateTodo,
    // deleteTodo
} = require('../controllers/Otodos')


router.route("/").post(createOTodo).get(getAllOTodos)
router.route("/:id").get(getOTodo)


module.exports = router