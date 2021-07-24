require('dotenv').config()
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_API,{ 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
