const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/signup', async (req,res) => {
    
    const newUser = new User({...req.body})

    try{
        await newUser.save()
        const user = await newUser.generateAuthToken()
        res.status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/login', async (req,res) => {
    try{
        user = await User.findByCredentials(req.body.name, req.body.password)
        user = await user.generateAuthToken()
        res.send(user)
    }
    catch(e){
        //console.log(e.message)
        res.status(400).send({errorMes: e.message})
    }
})

router.post('/logout', auth , async (req,res) => {
    try{
        await req.user.save()
        res.send()
    }
    catch(e) {
        res.status(500).send()
    }
})

router.get('/', auth , (req,res) => {
    res.send(req.user)
})

router.post('/bookmark', auth , async (req,res) => {
    try{
        user = req.user
        user.bookmarks = user.bookmarks.concat({recipeBookmarkedid: req.body.recipeBookmarkedid})
        user = await user.save()
        res.send(user.bookmarks)
    }
    catch(e) {
        res.status(400).send()
    }
})

router.delete('/bookmark/:id', auth , async (req,res) => {
    try{
        user = req.user
        const recipeId = req.params.id
        user.bookmarks = user.bookmarks.filter((bookmark) => {
            return bookmark.recipeBookmarkedid != recipeId
        })
        user = await user.save()
        res.send(user.bookmarks)
    }
    catch(e) {
        res.status(500).send(e)
    }
})

router.post('/published', async (req,res) => {
    try{
        req.user.publishedRecipes = req.user.publishedRecipes.concat({pubRecipeid: req.body.pubRecipeid})
        const user = await req.user.save()
        res.send(user.publishedRecipes)
    }
    catch(e) {
        res.status(500).send()
    }
})

router.delete('/published', async (req,res) => {
    try{
        req.user.publishedRecipes = req.user.publishedRecipes.filter((recipe) => {
            return recipe.pubRecipeid != req.body.pubRecipeid
        })
        const user = await req.user.save()
        res.send(user.publishedRecipes)
    }
    catch(e) {
        res.status(500).send()
    }
})

module.exports = router
