const jwt = require("jsonwebtoken")
const User = require('../models/User')
const {UnauthenticatedError} = require("../errors")

const authenticationMiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("You are not authorized")
    }
    const token = authHeader.split(" ")[1]

    try {   
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {

            req.user = {
                userId: payload.userId,
                name: payload.name
            }
            next()
        })
    } catch (err) {
        throw new UnauthenticatedError("You are not authorized")
    }

};

module.exports = authenticationMiddleware