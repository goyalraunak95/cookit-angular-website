const mongoose = require('mongoose')

const recipeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    imagePath: {
        type: String,
        required: true
    },
    recipeDetail: {
        type: String,
        required: true
    },
    ingrediants: [{
        name: {
            type: String,
            required: true
        },
        amount: {
            type: String,
            required: true
        }
    }],
    comments: [{
        author: {
            type: String,
            required: true
        },
        data: {
            type: String,
            required: true
        }
    }]
})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe