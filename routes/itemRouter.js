const router = require('express').Router()

const User = require('../models/User')
const Item = require('../models/Item')
const Collection = require('../models/Collection')
const Tags = require('../models/Tags')

const cloudinary = require('../config/cloudinary')

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/', async (req, res) => {
    try {
        const { id } = req.query

        const item = await Item.findById(id)

        if(!item){
           return res.status(404).json({ message: 'No item with that id' })
        }

        res.json(item)
    } catch (error) {
        res.status(500).json({ error })
    }

})

router.get('/tags', async (req, res) => {
    try {
        const tags = await Tags.find({})

        res.json(tags)
    } catch (error) {
        res.json({ error })
    }
})

router.post('/like', auth, async (req, res) => {
    try {
        const { id } = req.user
        const { itemId } = req.body 

        const item = await Item.findOne({_id: itemId})

        if(!item){
            return res.status(404).json({ message: 'You liked nonexistent item' })
        }

        if(!item.likes.usersId.find(e => e == id)) {
            item.likes.usersId.push(id)
            item.likes.number += 1
            item.save()
        }
        else {
            const index = item.likes.usersId.findIndex(e => e == id)

            item.likes.usersId.splice(index, 1)
            item.likes.number -= 1

            item.save()
        }

        res.json(item)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/removeComment', auth, async (req, res) => {
    try {
        const { commentId, itemId } = req.body
        const { id, userRole } = req.user
        
        const item = await Item.findById(itemId)

        const comment = item.comments.find(e => e._id == commentId)

        if(comment.userId !== id && userRole !== 'admin'){
            return res.status(401).json({ message: 'You dont have permissions' })
        }

        const index = item.comments.findIndex(e => e._id == commentId)

        item.comments.splice(index, 1)
        item.save()

        res.json(item)
    } catch (error) {
        
    }
})

router.post('/comment', auth, async (req, res) => {
    try {
        const { comment, itemId, collectionId } = req.body
        const { id, userPhoto, displayName } = req.user

        const collection = await Collection.findById(collectionId)

        if(!collection) {
            return res.status(404).json({ message: 'No collection find' })
        }

        if(!collection.comments) {
            return res.status(400).json({ message: 'Comments in this collection off' })
        }

        const item = await Item.findByIdAndUpdate(itemId, {
            $push: {
                comments: {
                    userId: id,
                    userPhoto,
                    userName: displayName,
                    comment,
                    date: Date.now()
                }
            }
        })

        res.json(item)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/search', async (req, res) => {
    try {
        const { searchText } = req.query
        
        console.log(searchText)

        const searchParam = new RegExp(searchText, 'gi')

        const resultItems = await Item.find({$or: [{
            tags: searchParam
        },{
            title: searchParam
        },{
            author: searchParam,
        }, {
            "comments.comment": searchParam
        }
        ]})

        console.log(resultItems)
        res.json(resultItems)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/add', auth, async (req, res) => {
    try {
        const { author, tags,  date, title, id, picture} = req.body

        if(!title){
            return res.status(400).json({ message: `Title can not be empty` })
        }

        const collection = await Collection.findById(id)

        if(!collection) {
            return res.status(404).json({ message: `Collection with id ${id} is nonexist` })
        }

        if(collection.owner != req.user.id && req.user.userRole !== 'admin') {
            return res.status(401).json({ message: 'You do not have permission for this operation' })
        }

        if(!collection.author && author)  {
            return res.status(400).json({ message: 'Author is not allow in this collection' })
        }

        if(!collection.year && date) {
            return res.status(400).json({ message: 'Year is not allow in this collection' })
        }

        const { url } = picture && await cloudinary.uploader.upload(picture, {
            upload_preset: 'ml_default'
        }, (err, result) => result)

        const item = new Item({
            collection_id: collection._id,
            author,
            tags: tags.map(e => e.value),
            year: date,
            title,
            picture: url,
            date: Date.now()
        })

        await item.save()

        collection.items_ids.push(item._id)
        
        await collection.save()

        if(tags) {
            tags.forEach(async e => {
                if(!(await Tags.exists({text: e.value}))) {
                    await Tags.create({
                        text: e.value,
                        date: Date.now()
                    })
                }
            })
        }       
        
        res.json(item)
    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router