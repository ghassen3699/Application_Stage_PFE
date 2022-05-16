const Joi = require('joi');


const PositionForm = data => {

    const schema = Joi.object({
        NA: Joi.string().min(2).max(50).messages({
            'string.base': `Il faut que NA de type text'`,
            'string.empty': `NA est vide`,
            'string.min': `Il faut que la longueur minimuim de NA est 2`,
            'any.required': `NA est utiliser`
        }),
        ID_VMS: Joi.string().length(7).messages({
            'string.base': `Il faut que ID_VMS de type text'`,
            'string.empty': `ID_VMS est vide`,
            'string.length': `Il faut que la longueur minimuim de IDVMS est 7`,
            'any.required': `ID_VMS est utiliser`
        }),
        RC: Joi.string().length(6).messages({
            'string.base': `Il faut que NA de type text'`,
            'string.empty': `RC est vide`,
            'string.length': `Il faut que la longueur est 6`,
            'any.required': `RC Le utiliser`
        }),
        DA: Joi.date().iso(),
        TI: Joi.string().length(4).messages({
            'string.base': `Il faut que TI de type text'`,
            'string.empty': `TI est vide`,
            'string.length': `Il faut que la longueur est 4`,
            'any.required': `TI Le utiliser`
        }),
        LT: Joi.string().min(2).max(12).messages({
            'string.base': `Il faut que LT de type text'`,
            'string.empty': `LT est vide`,
            'string.min': `Il faut que la longueur minimuim de LT est 2`,
            'any.required': `LT est utiliser`
        }),
        LG: Joi.string().min(2).max(12).messages({
            'string.base': `Il faut que LG de type text'`,
            'string.empty': `LG est vide`,
            'string.min': `Il faut que la longueur minimuim de LG est 2`,
            'any.required': `LG est utiliser`
        }),
        CO: Joi.string().min(1).max(12).messages({
            'string.base': `Il faut que CO de type text'`,
            'string.empty': `CO est vide`,
            'string.min': `Il faut que la longueur minimuim de CO est 2`,
            'any.required': `CO est utiliser`
        }),
        SP: Joi.string().min(1).max(3).messages({
            'string.base': `Il faut que SP de type text'`,
            'string.empty': `SP est vide`,
            'string.min': `Il faut que la longueur minimuim de SP est 1`,
            'any.required': `SP est utiliser`
        }),
        COM: Joi.string().min(2).max(12).messages({
            'string.base': `Il faut que COM de type text'`,
            'string.empty': `COM est vide`,
            'string.min': `Il faut que la longueur minimuim de COM est 2`,
            'any.required': `COM est utiliser`
        }),
        TM: Joi.string().length(3).messages({
            'string.base': `Il faut que TM de type text'`,
            'string.empty': `TM est vide`,
            'string.length': `Il faut que la longueur minimuim de TM est 7`,
            'any.required': `TM est utiliser`
        }),
        IPADDRESS: Joi.string().min(5).max(12).messages({
            'string.base': `Il faut que IPADRESS de type text'`,
            'string.empty': `IPADRESS est vide`,
            'string.min': `Il faut que la longueur minimuim de IPADRESS est 2`,
            'any.required': `IPADRESS est utiliser`
        }),

    })
    return schema.validate(data);
};

module.exports = PositionForm