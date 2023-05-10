const User = require('../models/User')
const {StatusCodes, RESET_CONTENT} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require("../errors")

const jwt = require('jsonwebtoken')


const register = async (req,res) => {

    const user = await User.create({...req.body})
    try {
        const token = user.createJWT()
            res
            .status(StatusCodes.CREATED)
            .json({user: { name: user.getName() }, token})

    } catch (err) {
        console.log(err)
    }
}


const login = async (req,res) => {
    const {password, email} = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const isPasswordCorrect = await user.comparePasswords(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user: { name: user.getName() }, token})

}


module.exports = {
    register, 
    login
}
