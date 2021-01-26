const mongoose = require('mongoose')

const tagsSchema = new mongoose.Schema({
    text: {
        type: String,
        unique: true
    },
    date: {
        type: Date
    }
})

module.exports = Tags = mongoose.model("tags", tagsSchema)