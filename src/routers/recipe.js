const express = require('express')
const Recipe = require('../models/recipe')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/', auth , async (req,res) => {
    delete req.body._id
     newRecipe = new Recipe({
        ...req.body
    })
    try{
        newRecipe = await newRecipe.save()
        console.log("Recipe Posted")

        user = await User.findOne({name: req.user.name})
        user.publishedRecipes = user.publishedRecipes.concat({pubRecipeid: newRecipe._id})
        user = await user.save()

        res.status(201).send({
            recipe: newRecipe,
            user: user
        })
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.get('/', auth , async (req,res) => {
    try{
        const recipes = await Recipe.find()
        console.log("Recipes fetched")
        res.status(201).send(recipes)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/:id', async (req,res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)

    try{
        const recipe = await Recipe.findOne({_id})
        if(!recipe)
            return res.status(404).send()
        updates.forEach((update) => {
            recipe[update] = req.body[update]
        })    
        await recipe.save()
        console.log("Recipe updated")
        res.send(recipe)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.delete('/:id', auth , async (req,res) => {
    const _id = req.params.id
    try{
        const recipe = await Recipe.findOne({_id})
        if(!recipe)
            return res.status(404).send()
        await recipe.remove()
        console.log("Recipe Deleted")
        req.user.publishedRecipes = req.user.publishedRecipes.filter((recipe) => {
                        return recipe.pubRecipeid != req.body.pubRecipeid
                    })
        await req.user.save()
        res.send(recipe)    
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.post('/comment/:id', auth , async (req,res) => {
    const _id = req.params.id
    try{
        recipe = await Recipe.findOne({_id})
        if(!recipe)
            return res.status(404).send()
        delete req.body._id    
        recipe.comments = recipe.comments.concat({...req.body})
        recipe = await recipe.save()
        console.log("Comment Posted")
        res.status(201).send(recipe.comments)
    }
    catch(e){
        res.status(500).send(e)
    }
})

// router.get('/comment/:id', auth , async (req,res) => {
//     const _id = req.params.id
//     try{
//         const recipe = await Recipe.findOne({_id})
//         if(!recipe)
//             return res.status(401).send()
//         res.status(201).send(recipe.comments)    
//     }
//     catch(e){
//         res.status(500).send()
//     }
// })

module.exports = router