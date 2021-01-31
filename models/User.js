const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    userPhoto: {
        type: String
    },
    displayName: {
        type: String
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    userRole: {
        type: String,
        default: 'user'
    },
    blocked: {
        type: Boolean,
        default: false
    },
    registerDate: {
        type: String
    },
    collections: {
        type: [String]
    },
    lang: {
        type: String,
        default: "en"
    }
})

module.exports = User = mongoose.model("user", userSchema)