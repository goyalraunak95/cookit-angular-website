require('dotenv').config()
const express = require('express')
require('./db/mongoose')
const cors = require('cors')
const recipeRouter = require('./routers/recipe')
const userRouter = require('./routers/user')

const app = express()
const port = process.env.PORT

app.use(express.static(process.cwd() + "/angular-app/dist/project"))

app.use(express.json())

app.use(cors())

app.use('/recipe',recipeRouter)
app.use('/user', userRouter)

app.get('*', (req,res) => {
    res.sendFile(process.cwd() + "/angular-app/dist/project/index.html")
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})