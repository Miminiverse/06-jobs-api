const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require("../errors")

const jwt = require('jsonwebtoken')

// register --> await token (promise) --> await createJWT (promise) 
// createJWT() --> return a Promise for a callback?

// UserSchema.methods.createJWT = function () {
//     return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: '30d'})
// }


const register = async (req,res) => {

    const user = await User.create({...req.body})
    try {
        const token = await user.createJWT()
        res
            .status(StatusCodes.CREATED)
            .json(
                {user: 
                    { name: user.getName(),
                        email:  user.getEmail(),
                    }, 
                loggedIn: true,
                token}
                )

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

    console.time("create JWT")



    const token = await user.createJWT()
    console.timeEnd("create JWT")
    res.status(StatusCodes.OK).json(
        {user: 
            { name: user.getName(),
                email:  user.getEmail(),
            }, 
        loggedIn: true,
        token}
        )
}


module.exports = {
    register, 
    login
}
