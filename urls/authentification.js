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
            return res.render('authentication/registerPage', { msg: error, user: user })
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
//-----------------------------------------------------------------------------------------------------------------------------------------//
authRouter.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy(function() {
            res.redirect('/')
        })
    } else {
        res.redirect('/')
    }
})

//------------------------------------------------------------------------------------------------------------------------------------------//


// gestion des utilisateurs
authRouter.get('/manage-accounts', function(req, res) {
    if (req.session.user) {

        sql = "SELECT * FROM ACCOUNTS  ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }

            return res.render('authentication/manageAccounts', { accounts: result, user: req.session.user })
        })
    } else {
        return res.redirect('/')
    }
})


//-------------------------------------------------------------- Supprimer user  ------------------------------------------------------------------------------//
// GET method
authRouter.get('/supprimer-account/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        return res.render('authentication/supprimerAccounts', { user: user })
    } else {
        res.redirect('/')
    }

});

// POST method
authRouter.post('/supprimer-account/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = ?"
        db.query(sql, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            const sqlDelete = "DELETE FROM ACCOUNTS WHERE ID_USER = ?"
            db.query(sqlDelete, (req.params.id), (err, result) => {
                if (err) {
                    throw err // remplacer par 404 NOT FOUND
                }
            })
        })
        return res.redirect('/manage-accounts')
    } else {
        res.redirect('/')
    }

});
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//




//----------------------------------------------------------- modifier user ---------------------------------------------------------------------------//
// GET method
authRouter.get('/modifier-account/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = ? "
        const msg = ""
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            var name
            result.forEach(user => {
                name = user['NOM'] + ' ' + user['PRENOM']
            });
            return res.render('authentication/modifierUser', { userDate: result, name: name, msg: msg, user: user })
        })
    } else {
        res.redirect('/')
    }

});


//authRouter.post('/modifier-account/:id', function(req, res) {
// POST method 
authRouter.post('/modifier-account/:id', function(req, res) {
    var user = req.session.user
    if (user) {

        var sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = " + req.params.id + " ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            const { error } = CompteFormulaire(req.body)
            var name
            result.forEach(userDATA => {
                name = userDATA['NOM'] + ' ' + userDATA['PRENOM']
            });
            if (error) {
                return res.render('authentication/modifierUser', { userDate: result, name: name, msg: error, user: user })
            } else {
                const sql2 = "UPDATE ACCOUNTS SET USERNAME = ?, NOM = ?, PRENOM = ?, EMAIL = ?, PASSWORD = ?, ADMIN = ? WHERE ID_USER = ?"
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

                db.query(sql2, [req.body.USERNAME, req.body.NOM, req.body.PRENOM, req.body.EMAIL, req.body.PASSWORD, ADMINOption, req.params.id], (err, result) => {
                    if (err) {
                        throw err
                    }
                    console.log(result)
                    return res.redirect('/manage-accounts')
                })
            }
        })
    } else {
        return res.redirect('/')
    }
})

//-------------------------------------------------------------------------------------------------------------------------------------------------------//


// // GET method
// authRouter.get('/change-password', function(req, res){
//     var user = req.session.user
//     if (user){
//         const msg = ''
//         const sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = " + user.ID_USER + " ;"
//         db.query(sql, (err, result)=>{
//             if (err){
//                 throw err
//             }
//             return res.render("authentication/modifier_password",{userData: result, msg: msg})
//         })

//     }else {
//         req.redirect('/')
//     }
// })


// // POST method
// authRouter.post('/change-password', function(req, res) {
//     var user = req.session.user
//     if (user) {
//         const msg = "Entrer "
//         const sql = "UPDATE ACCOUNTS SET PASSWORD WHERE ID_USER = " + user.ID_USER + " ;"
//         db.query(sql, (err, result) => {
//             if (err) {
//                 throw err
//             }
//             req.session.destroy(function() {
//                 res.redirect('/')
//             })
//         })

//     } else {
//         req.redirect('/')
//     }
// })


// modifier les données de l'utilisateur 
// GET method 
authRouter.get('/change-data', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = ? "
        const msg = ""
        db.query(sql, [user[0]['ID_USER']], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            var name
            result.forEach(user => {
                name = user['NOM'] + ' ' + user['PRENOM']
            });
            return res.render('authentication/modifierUserInformations', { userDate: result, name: name, msg: msg, user: user })
        })
    } else {
        res.redirect('/')
    }
})


// POST method 
authRouter.post('/change-data', function(req, res) {
    var user = req.session.user
    if (user) {

        var sql = "SELECT * FROM ACCOUNTS WHERE ID_USER = " + user[0]['ID_USER'] + " ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            const { error } = CompteFormulaire(req.body)
            var name, ADMINOption
            result.forEach(userDATA => {
                name = userDATA['NOM'] + ' ' + userDATA['PRENOM']
                ADMINOption = userDATA['ADMIN']
            });

            if (error) {
                return res.render('authentication/modifierUserInformations', { userDate: result, name: name, msg: error, user: user })
            } else {
                const sql2 = "UPDATE ACCOUNTS SET USERNAME = ?, NOM = ?, PRENOM = ?, EMAIL = ?, PASSWORD = ?, ADMIN = ? WHERE ID_USER = ?"

                if (ADMINOption === 1) {
                    ADMINOption = true
                } else {
                    ADMINOption = false
                }

                console.log(ADMINOption)
                db.query(sql2, [req.body.USERNAME, req.body.NOM, req.body.PRENOM, req.body.EMAIL, req.body.PASSWORD, ADMINOption, user[0]['ID_USER']], (err, result) => {
                    if (err) {
                        throw err
                    }
                    console.log(result)
                    return res.redirect('/home')
                })
            }
        })
    } else {
        return res.redirect('/')
    }
})




module.exports = authRouter;