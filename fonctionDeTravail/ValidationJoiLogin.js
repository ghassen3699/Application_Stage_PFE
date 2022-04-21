const Joi = require('joi');


const validationLogin = data => {

    const schema = Joi.object({
        EMAIL: Joi.string().email({ tlds: { allow: false } }),
        PASSWORD: Joi.string().min(3).max(15).required(),
    })
    return schema.validate(data);
};

module.exports.validationLogin = validationLogin