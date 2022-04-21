const Joi = require('joi');


const registerForm = data => {

    const schema = Joi.object({
        NA: Joi.string().min(2).max(50).messages({
            'string.base': `Il faut que NA de type text'`,
            'string.empty': `NA est vide`,
            'string.min': `Il faut que la longueur minimuim de NA est 2`,
            'any.required': `NA est utiliser`
        }),
        ID_VMS: Joi.string().length(7).messages({
            'string.base': `ID_VMS Il faut que ID_VMS de type text'`,
            'string.empty': `ID_VMS est vide`,
            'string.length': `ID_VMS Il faut que la longueur minimuim de IDVMS est 7`,
            'any.required': `ID_VMS est utiliser`
        }),
        IMEI: Joi.string().length(15).pattern(/^[0-9]+$/).messages({
            'string.base': `IMEI Il faut que IMEI de type text'`,
            'string.empty': `IMEI est vide`,
            'string.length': `Il faut que la longueur minimuim est de IMEI 15`,
            'any.required': `IMEI est utiliser`
        }),
        ICCID: Joi.string().length(18).pattern(/^[0-9]+$/).messages({
            'string.base': `Il faut que ICCID de type text'`,
            'string.empty': `ICCID est vide`,
            'string.length': `Il faut que la longueur de ICCID est 18`,
            'any.required': `ICCID est utiliser`
        }),
        RC: Joi.string().length(6).messages({
            'string.base': `RC Il faut que NA de type text'`,
            'string.empty': `RC est vide`,
            'string.length': `RC Il faut que la longueur est 6`,
            'any.required': `RC Le utiliser`
        }),
        KEY_AES: Joi.string().length(32).messages({
            'string.base': ` Il faut que KEY_AES de type text'`,
            'string.empty': `KEY_AES est vide`,
            'string.length': `Il faut que la longueur de KEY_AES est 32`,
            'any.required': `KEY_AES est utiliser`
        }),
        DABEG: Joi.date().iso(),
        DAEND: Joi.date().iso()
    })
    return schema.validate(data);
};

module.exports.registerForm = registerForm