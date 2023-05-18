const Todo = require('../models/Todo')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, NotFoundError} = require("../errors")


const getAllTodos = async (req,res) => {
    const todos = await Todo.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json(todos)
}


const getTodo = async (req,res) => {
    
}


const createTodo = async (req,res) => {
    req.body.createdBy = req.user.userId
    const todo = await Todo.create(req.body)
    res.status(StatusCodes.CREATED).json(todo)

}

const updateTodo = async (req,res) => {

}

const deleteTodo = async (req,res) => {

}


module.exports = {
    getAllTodos, 
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo
}