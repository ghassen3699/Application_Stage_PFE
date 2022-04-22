const Joi = require('joi');


const CompteFormulaire = data => {

    const schema = Joi.object({
        USERNAME: Joi.string().min(2).max(20).messages({
            'string.base': `Il faut que USERNAME de type text'`,
            'string.empty': `USERNAME est vide`,
            'string.min': `Il faut que la longueur minimuim de USERNAME est 2`,
            'any.required': `USERNAME est utiliser`
        }),
        NOM: Joi.string().min(2).max(20).messages({
            'string.base': `Il faut que NOM de type text'`,
            'string.empty': `NOM est vide`,
            'string.min': `Il faut que la longueur minimuim de NOM est 2`,
            'any.required': `NOM est utiliser`
        }),
        PRENOM: Joi.string().min(2).max(20).messages({
            'string.base': `Il faut que PRENOM de type text'`,
            'string.empty': `PRENOM est vide`,
            'string.min': `Il faut que la longueur minimuim de PRENOM est 2`,
            'any.required': `PRENOM est utiliser`
        }),
        EMAIL: Joi.string().email().messages({
            'string.base': `Invalide Email'`,
        }),
        PASSWORD: Joi.string().min(5).max(15).messages({
            'string.base': `Il faut que PASSWORD de type text'`,
            'string.empty': `PASSWORD est vide`,
            'string.min': `Il faut que la longueur minimuim de PASSWORD est 5`,
            'any.required': `PASSWORD est utiliser`
        }),
        PASSWORD2: Joi.string().min(5).max(15).messages({
            'string.base': `Il faut que La Confirmation Du Mots De Passe de type text'`,
            'string.empty': `La Confirmation Du Mots De Passe est vide`,
            'string.min': `Il faut que la longueur minimuim de La Confirmation Du Mots De Passe est 5`,
            'any.required': `La Confirmation Du Mots De Passe est utiliser`
        }),
        ADMIN: Joi.boolean(),

    })
    return schema.validate(data);
};

module.exports = CompteFormulaire