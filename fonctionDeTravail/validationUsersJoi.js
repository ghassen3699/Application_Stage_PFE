const Joi = require('joi');


const registerFormLogin = loginData => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    })
    return schema.validate(loginData);
};


const registerFormRegisterUser = registerUserData => {
    const schema = Joi.object({
        nom: Joi.string().minLength(1).required(),
        prenom: Joi.string().minLength(3).required(),
        email: Joi.string().email(),
        password: Joi.string.required(),

        // option admin pour creer les comptes 
        adminOption: Joi.boolean().required(),

        // poste du travail 
        poste: Joi.string().required(),
    })

    return schema.validate(registerUserData)
};


module.exports.registerFormRegisterUser = registerFormRegisterUser
module.exports.registerFormLogin = registerFormLogin