const express = require('express');
const authRouter = express.Router();
const mysql = require('mysql');
const CompteFormulaire = require('../fonctionDeTravail/validationUsersJoi');


//--------------------------------------------------------- La connexion entre NodeJs et Mysql -----------------------------------------------------------//

const db = mysql.createConnection({
    host: 'localhost',
    //host: '193.95.21.63',
    user: 'root',
    password: 'Ghassen1234@',
    database: 'VMS',
    multipleStatements: true
});


db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Mysql')
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------- la page login de l'application -------------------------------------------------------//
// GET method 
authRouter.get('/', function(req, res) {
    var msg = ''
    return res.render('authentication/loginPage')
});


// POST method 
authRouter.post('/', function(req, res) {

    USERNAME = req.body.USERNAME
    PASSWORD = req.body.PASSWORD

    db.query("SELECT * FROM ACCOUNTS WHERE (USERNAME = '" + USERNAME + "') AND (PASSWORD = '" + PASSWORD + "') ;", (err, result) => {
        if (err) {
            throw err
        }
        if (result.length === 1) {

            req.session.user = result
            req.session.opp = 1
            return res.redirect('/home')
        } else {
            return res.render('authentication/loginPage', { msg: 'ValidationError: Entrer le Username ou le Mots de passe correctement' })
        }
    })
});
//----------------------------------------------------------------------------------------------------------------------------------------//




//-------------------------------------------------- la page signUp de l'application -------------------------------------------------------//
// GET method 
authRouter.get('/register', function(req, res) {
    var user = req.session.user

    if (user) {
        var msg = ''
        return res.render('authentication/registerPage', { msg, user: user })
    } else {
        return res.redirect('/')
    }

});





// POST method 
authRouter.post('/register', function(req, res) {

    var user = req.session.user

    if (user) {
        const { error } = CompteFormulaire(req.body)

        if (error) {
            return res.render('authentication/registerPage', { msg: error })
        } else {
            console.log(req.body)
            if (req.body.PASSWORD !== req.body.PASSWORD2) {
                return res.render('authentication/registerPage', { msg: 'ValidationError: La confirmation de Mots de passe est fausse', user: user })
            }



            db.query("SELECT * FROM ACCOUNTS WHERE (USERNAME = '" + req.body.USERNAME + "') OR ( EMAIL = '" + req.body.EMAIL + "' )", (err, result) => {
                if (err) {
                    throw err
                }
                if (result.length > 0) {
                    return res.render('authentication/registerPage', { msg: "ValidationError: Le Username ou adresse mail est deja utiliser", user: user })
                }

                db.query("SELECT * FROM ACCOUNTS ORDER BY ID_USER DESC LIMIT 1 ;", (err, result) => {
                    if (err) {
                        throw err
                    }
                    var id
                    result.forEach(resultEelement => {
                        id = resultEelement['ID_USER'] + 1
                    });

                    var ADMINOption
                    if (req.body.ADMIN) {
                        if (req.body.ADMIN === "true") {
                            ADMINOption = true
                        } else {
                            ADMINOption = false
                        }

                    } else {
                        ADMINOption = false
                    }
                    console.log(ADMINOption)

                    const sql = "INSERT INTO ACCOUNTS VALUES(?,?,?,?,?,?,?)"
                    db.query(sql, [id, req.body.USERNAME, req.body.NOM, req.body.PRENOM, req.body.EMAIL, req.body.PASSWORD, ADMINOption], function(err, result) {
                        if (err) {
                            throw err
                        }
                        return res.render('authentication/registerPage', { msg: 'Compte Ajouter', user: user })
                    })
                })

            })
        }
    } else {
        return res.redirect('/')
    }


});
//----------------------------------------------------------------------------------------------------------------------------------------//



// Logout page
authRouter.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy(function() {
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

module.exports = authRouter;