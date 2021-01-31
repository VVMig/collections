const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const PORT = process.env.PORT || 4000
const path = require('path')
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

app.use(express.static('frontend/build'))

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/frontend/build', 'index.html'));
});

//Routes
app.use('/api/user', user)
app.use('/api/collections', collections)
app.use('/api/item', item)