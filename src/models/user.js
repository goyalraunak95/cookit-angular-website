const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

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
    token: {
        type: String
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

userSchema.methods.generateAuthToken = async function () {
    user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'secretKey')
    user.token = token
    user = await user.save()
    return user
}

userSchema.statics.findByCredentials = async (name, password) => {
    const user = await User.findOne({ name })
    if(!user)
        throw new Error('You are not signed in')
    
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