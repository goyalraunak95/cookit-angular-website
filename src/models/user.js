const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    bookmarks: [{
        recipeBookmarkedid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    }],
    publishedRecipes: [{
        pubRecipeid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    }]
})

userSchema.methods.toJSON = function () {
    const user = this.toObject()
    delete user.password
    return user
}

userSchema.statics.generateAuthToken = async (user) => {
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY)
    return token
}

userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({ name })
    if(!user)
        throw new Error('You are not signed up')
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw new Error('Password is incorrect')
    
    return user    
}

userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User