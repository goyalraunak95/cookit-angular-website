require('dotenv').config()
const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_API,{ 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("Connected to Database");
})
.catch((e)=>{
    console.log("Error while connecting to database,",e);
})
