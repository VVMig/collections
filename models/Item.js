const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    collection_id: {
        type: String
    },
    title: {
        type: String
    },
    tags: {
        type: [String]
    },
    picture: {
        type: String
    },
    likes: {
        usersId: [String],
        number: {
            type: Number,
            default: 0
        }       
    },
    comments: {
        type: [{
            userId: String,
            userPhoto: String,
            userName: String,
            comment: String,
            date: Date
        }]
    },
    author: {
        type: String
    },
    year: {
        type: Date
    },
    date: {
        type: Date
    }
})

module.exports = Item = mongoose.model("item", itemSchema)