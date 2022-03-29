const express = require('express');
const authRouter = express.Router();
const { registerFormLogin, registerFormRegisterUser } = require('../fonctionDeTravail/validationUsersJoi');






//-------------------------------------------------- la page login de l'application -------------------------------------------------------//
// GET method 
authRouter.get('/', function(req, res) {
    return res.render('authentication/loginPage')
});


// POST method 
authRouter.post('/', function(req, res) {

    // valider email et password
    const { error } = registerFormLogin(req.body)

    if (error) {
        return res.render('authentication/loginPge', { msg: error })

    } else {
        // tester l'adresse mail et existe ou non 
        const sqlValidEmail = "SELECT * FROM users WHERE EMAIL = " + req.body.email + ";"
        db.query(sqlValidEmail, (err, result) => {
            if (err) {
                throw err;
            }

            // si l'adresse mail est existe 
            if (result.length > 0) {

                // tester si la mots de passe est vrai ou non 
                const sqlValidCompte = "SELECT * FROM users WHERE (EMAIL = " + req.body.email + ") and (PASSWORD = " + req.body.password + ");"
                db.query(sqlValidCompte, (err, result) => {
                    if (err) {
                        throw err;
                    }
                    // si le compte est existe 
                    if (result.length > 0) {
                        return res.render('home/home') // si existe 
                    } else {
                        const msg = "Mots de passe ou password est incorrecte"
                        return res.render('authentication/loginPge', { msg: msg })
                    }
                })

            } else {
                // si l'adresse mail n'existe pas 
                const msg = "Mots de passe ou Password incorrectes"
                return res.render('authentication/loginPge', { msg: msg })
            }

        });
    }
});
//----------------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------- la page signup de l'application -------------------------------------------------------//


//----------------------------------------------------------------------------------------------------------------------------------------//

module.exports = authRouter;