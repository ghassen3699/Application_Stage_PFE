const Joi = require('joi');


const registerForm = data => {

    const schema = Joi.object({
        NA: Joi.string().min(0).max(50),
        ID_VMS: Joi.string().length(7),
        IMEI: Joi.string().length(15).pattern(/^[0-9]+$/),
        ICCID: Joi.string().length(18).pattern(/^[0-9]+$/),
        RC: Joi.string().length(6),
        KEY_AES: Joi.string().length(32),
        DABEG: Joi.date().iso(),
        DAEND: Joi.date().iso()
    })
    return schema.validate(data);
};

module.exports.registerForm = registerForm