const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function auth(req, res, next) {
    try {
        const token = req.header("x-auth-token");

        if (!token || token === 'undefined')
          return res
            .status(401)
            .json({ error: {message: "No authentication token, authorization denied." }});
    
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        if (!verified)
          return res
            .status(401)
            .json({ error: {message: "Token verification failed, authorization denied." }});
    
        
        const user = await User.findOne({_id: verified.id})
        
        if(user.blocked)
          return res
          .status(401)
          .json({ error : {message: "User has been blocked" }});

        req.user = {
            id: user._id,
            darkMode: user.darkMode,
            email: user.email,
            displayName: user.displayName,
            userRole: user.userRole,
            blocked: user.blocked,
            userPhoto: user.userPhoto,
            lang: user.lang
        }

        next();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }  
}