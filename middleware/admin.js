 module.exports = async (req, res, next) => {
    try {
        if(req.user.userRole !== 'admin') {
            return res.status(403).json({ error: { message: 'You dont have permissions for this page'}})
        }

        next()
    } catch (error) {
        res.status(500).json({ error });
    }
}
