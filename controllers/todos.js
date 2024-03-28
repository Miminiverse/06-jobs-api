const Todo = require('../models/Todo')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require("../errors")


const getAllTodos = async (req, res) => {
    try {
        // Retrieve all todos from the Todo collection and sort by createdAt
        const todos = await Todo.find({}).sort('createdAt');

        // Send todos as JSON response with status code 200 (OK)
        res.status(StatusCodes.OK).json({ todos });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching todos:', error);
        // Send an error response with appropriate status code
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
};


const getTodo = async (req,res) => {
    const {user: {userId}, params: {id: todoId}} = req
    const todo = await Todo.findOne({ 
        _id: todoId,
        createdBy: userId
    })
    if (!todo) {
        throw new NotFoundError(`No todo with id`)
    }
    res.status(StatusCodes.OK).json({todo})
}


const createTodo = async (req,res) => {
    try {
        // Extract the title and content from req.body
        const { title, content } = req.body;

        // Create a todo with the extracted title and content
        const todo = await Todo.create({
            title,
            content,
        });

        // Send the created todo as JSON response with status code 201 (Created)
        res.status(StatusCodes.CREATED).json({ todo });
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error creating todo:', error);
        // Send an error response with appropriate status code
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}

const updateTodo = async (req,res) => {
    const {
        body:  {title, content}, 
        user: {userId}, 
        params:{id: todoId},
    } = req

    if (title === "" || content === "") {
        throw new BadRequestError("Title or Content can not be emptied")
    }
    const todoUpdated = await Todo.findByIdAndUpdate({
        _id: todoId,
        createdBy: userId
    }, req.body, 
    {new:true, runValidators: true}
    )
    if (!todoUpdated) {
        throw new NotFoundError(`No todo with id`)
    }
    res.status(StatusCodes.OK).json({todoUpdated})
}

const deleteTodo = async (req,res) => {
    const {user: {userId}, params: {id: todoId}} = req
    const todo = await Todo.findByIdAndRemove({
        _id: todoId,
        createdBy: userId
    })
    if (!todo) {
        throw new NotFoundError(`No todo with id`)
    }
    res.status(StatusCodes.OK).json("delete")
}


module.exports = { 
    getAllTodos, 
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}