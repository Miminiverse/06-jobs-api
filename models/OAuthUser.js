const mongoose = require('mongoose')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');


const OAuthUserSchema = new mongoose.Schema({
    username: {
        required: true, 
        type: String
    },
    googleId: {
        required: false, 
        type: String
    }
});

module.exports = mongoose.model('OAuthUser', OAuthUserSchema)
