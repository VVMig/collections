const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    owner: {
        type: String,
        require: true
    },
    picture: {
        type: String
    },
    title: {
        type: String
    },
    description: {
        type: String
    },
    topic: {
        type: String
    },
    author: {
        type: Boolean
    },
    year: {
        type: Boolean
    },
    comments: {
        type: Boolean
    },
    items_ids: {
        type: [String]
    }
})

module.exports = Collection = mongoose.model("collection", collectionSchema)