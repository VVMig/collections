const router = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const User = require('../models/User')
const Item = require('../models/Item')
const Collection = require('../models/Collection')
const Tags = require('../models/Tags')

const userValid = require('../helpers/auth_validation')

const auth = require('../middleware/auth')
const admin = require('../middleware/admin');

router.post('/register', async (req, res) => {
    let {email, password, passwordCheck, displayName} = req.body

    try {
        const { error } = userValid.validate({email, password, displayName})

        if(error){
            return res.status(400).json({success: false, error: { message: error.details[0].message , target: error.details[0].path[0]}})           
        }

        if(password !== passwordCheck) {
            return res.status(400).json({ success: false, error: { message: "Passwords do not match", target: 'password' }})           
        }

        const exists = await User.exists({ email })

        if(exists){
            return res.status(400).json({success: false,  error: { message: "User with this email already exists", target: 'email' }})           
        }
        else if(!exists.password) {
            await User.findOneAndDelete({ email })
        }
        
        const salt = await bcrypt.genSalt(10)
        password = await bcrypt.hash(password, salt)

        const user = new User({
            email,
            password,
            displayName,
            registerDate: new Date().toString()
        })
        
        const result = await user.save()

        res.json({success: true, result })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/login', async (req, res) => {
    try {
        let {email, password, idToken, vkId} = req.body

        if(idToken){
            const ticket = await client.verifyIdToken({
                idToken,
                audience: '327702379277-a035t5hfkakgfb0dt3111c7eiio2458p.apps.googleusercontent.com'
            })

            const payload = ticket.getPayload()           

            const user = await User.findOne({ email: payload.email })

            if(!user){
                await User.create({
                    email: payload.email,
                    displayName: payload.name,
                    registerDate: Date.now()
                })
            }

            email = payload.email
        }
        else if(vkId) {

            vkId.email += '@vk.com'

            const user = await User.findOne({email: vkId.email})

            if(!user){
                await User.create({
                    email: vkId.email,
                    displayName: vkId.displayName,
                    registerDate: Date.now()
                })
            }

            email = vkId.email
        }
        else if(!email || !password)
            return res.status(400).json({ error: {message: 'Incorrect email or password' }})

        const user = await User.findOne({ email })
        
        if(!user) {
            return res.status(400).json({ error: {message: 'Incorrect email or password' }})
        }

        if(user.blocked) {
            return res.status(400).json({ error: {message: 'User has been blocked' }})
        }

        if(!idToken && !vkId) {
            const isMatch = await bcrypt.compare(password, user.password) 

            if(!isMatch){
                return res.status(400).json({ error: {message: 'Incorrect email or password' }})
            }
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({
            token: token,
            user: {
                id: user._id,
                darkMode: user.darkMode,
                email: user.email,
                displayName: user.displayName,
                userRole: user.userRole,
                blocked: user.blocked, 
                userPhoto: user.userPhoto
            }
        })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/verifyToken', async (req, res) => {
    try {
        const token = req.header("x-auth-token");

        if (!token) return res.json(false);
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) return res.json(false);
    
        const user = await User.findById(verified.id);
        if (!user) return res.json(false);
        

        return res.json(true);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

router.get('/', auth, (req, res) => res.json(req.user))

router.post('/switchLang', auth, async (req, res) => {
    try {
        const { lang } = req.body
        const user = await User.findById(req.user.id)

        user.lang = lang

        await user.save()

        res.json(lang)
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/home', async (req, res) => {
    try {
        const lastAdded = await Item.find({}).sort({ date: -1 }).limit(9)

        const mostLike = await Item.find({}).sort({ 'likes.number': -1 }).limit(5)

        const tags = await Tags.find({}).sort({ date: -1 })

        res.json({
            lastAdded,
            mostLike,
            tags
        })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/profile', async (req, res) => {
    try {
        const { id } = req.query

        if(!id){
            return res.status(400).json({ error: {message: 'Param id is empty'}})
        }

        if(id.length !== 24){
            return res.status(400).json({ error: {message: 'Invalid id'}})
        }

        const user = await User.findById(id)
        const collections = await Collection.find({ owner: id })

        if(!user) {
            return res.status(400).json({ error: {message: 'No user with this id'}})
        }

        return res.json({
            user: {
                id: user._id,
                displayName: user.displayName,
                registerDate: user.registerDate,
                email: user.email,
                userRole: user.userRole,
                blocked: user.blocked,
                userPhoto: user.userPhoto,
                collections: collections.length
            }
        })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.get('/users', auth, admin, async (req, res) => {
    try {
        if(req.user.userRole !== 'admin') {
            return res.status(401).json({ error: 'Dont have permission' })
        }
    
        const users = await User.find()
    
        return res.json(users)
    } catch (error) {
        res.status(500).json({ error: err.message })
    }
})

router.delete('/delete', auth, admin, async (req, res) => {
    try {
        const { id } =  req.query

        await User.findByIdAndDelete(id)

        res.json({ message: 'user have been deleted' })
    } catch (error) {
        res.status(500).json({ error })
    }
})

router.post('/removeAdmin', auth, admin, async (req, res) => {
    try {
        const { id } = req.body
        
        await User.findByIdAndUpdate(id, { userRole: 'user' })

        res.json({ message: 'user role has been changed' })
    } catch (error) {
        res.status(500).json({ error })    
    }   
})

router.post('/setAdmin', auth, admin, async (req, res) => {
    try {
        const { id } = req.body
        
        await User.findByIdAndUpdate(id, { userRole: 'admin' })

        res.json({ message: 'user role has been changed' })
    } catch (error) {
        res.status(500).json({ error })    
    }   
})

router.post('/block', auth, admin, async (req, res) => {
    try {
        const { id } = req.body

        await User.findByIdAndUpdate(id, { blocked: true })

        res.json({ message: 'user has been blocked' })
    } catch (error) {
        res.status(500).json({ error })    
    }
})

router.post('/unblock', auth, admin, async (req, res) => {
    try {
        const { id } = req.body

        await User.findByIdAndUpdate(id, { blocked: false })

        res.json({ message: 'user has been unblocked' })
    } catch (error) {
        res.status(500).json({ error })    
    }
})

module.exports = router