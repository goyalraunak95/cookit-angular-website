const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://raungoyal:raungoyal12200@cluster0.wz4bn.mongodb.net/cook-it?retryWrites=true&w=majority',{ 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
