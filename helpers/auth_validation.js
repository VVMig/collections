const Joi = require('joi')

const Schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(1),
    displayName: Joi.string().required()
})

module.exports = Schema