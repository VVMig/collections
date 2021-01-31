const router = require('express').Router()

const User = require('../models/User')
const Item = require('../models/Item')
const Collection = require('../models/Collection')

const cloudinary = require('../config/cloudinary')

const auth = require('../middleware/auth')

router.delete('/delete', auth, async (req, res) => {
    try {
        const { id } = req.query

        if(!id) {
            return res.status(400).json({ message: 'Nothing to delete' })
        }

        const collection = await Collection.findByIdAndDelete(id)

        await User.findByIdAndUpdate(collection.owner, {$pull: {
            collections: id
        }})

        res.json(collection)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/collection', async (req, res) => {
    try {
        const { id } = req.query

        if(!id){
            return res.status(404).json({ message: 'No collection with this id' })
        }

        const collection = await Collection.findById(id)
        const itemsIds = collection['items_ids']

        if(!collection){
            return res.status(404).json({ message: 'No collection with this id' })
        }
        
        const items = []
        
        for (const itemId of itemsIds) {
            items.push(await Item.findById(itemId))
        }

        res.json({
            items,
            collection
        })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/', async (req, res) => {
    try {
        const { id } = req.query

        if(!id){
            return res.status(404).json({ message: 'This user dont have any collection yet' })
        }

        const collections = await Collection.find({ owner: id})

        if(!collections.length){
            return res.status(404).json({ message: 'This user dont have any collection yet' })
        }
        
        res.json(collections)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/upload', auth, async (req, res) => {
    try {
        const { owner, picture, title, description, topic, author, year, comments } = req.body

        if(!owner) {
            return res.status(400).json({ message: 'Collection must have owner' })
        }

        if(!title || !description || !topic || author === undefined || year === undefined || comments === undefined){
            return res.status(400).json({ message: 'No all information' })
        }

        const { url } = picture && await cloudinary.uploader.upload(picture, {
                upload_preset: 'ml_default'
            }, (err, result) => result)

        const collection = await Collection.create({
            owner,
            picture: url,
            title,
            description,
            topic,
            author,
            year,
            comments
        })

        await User.findByIdAndUpdate(req.user.id, {$push: {
            collections: collection._id
        }})

        res.json(collection)
    } catch (error) {
        console.log(error)
        res.status(500).json({ error })
    }
})

module.exports = router