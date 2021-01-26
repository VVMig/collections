const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 4000

const tags = require('./models/Tags')

const user = require('./routes/userRouter')
const collections = require('./routes/collectionsRouter')
const item = require('./routes/itemRouter')

require('dotenv').config()

app.use(express.json({limit: '50mb'}))
app.use(cors())

app.listen(PORT, () => console.log(`Server has been started on ${PORT}`))

mongoose.connect(process.env.MONGODB_STRING, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if(err) throw err
    console.log('MongoDB have been connected')
})

if(process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'))
}

//Routes
app.use('/user', user)
app.use('/collections', collections)
app.use('/item', item)