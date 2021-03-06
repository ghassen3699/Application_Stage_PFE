const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const validationAbonnement = require('../fonctionDeTravail/validationAbonnement');
const extraireDate = require('../fonctionDeTravail/extraireDate');
const validationUndifined = require('../fonctionDeTravail/validationUndifined');
const testDate = require('../fonctionDeTravail/testDate');
const navireRouter = express.Router();
const { registerForm } = require('../fonctionDeTravail/validationJoi');
const PositionForm = require('../fonctionDeTravail/validationPosition');



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









///////////////////////////////////////////////////////////// LES CRUD DE LA TABLE TOBINFO ///////////////////////////////////////////////////////////////////////




//----------------------------------------------------------------- Ajouter navire -----------------------------------------------------------------------//
// GET method
navireRouter.get('/ajouter', function(req, res) {
    var user = req.session.user

    if (user) {
        var msg = ''
        return res.render('navire/ajouterNavire', { msg, user: user })
    } else {
        res.redirect('/')
    }

});

// POST method
navireRouter.post('/ajouter', function(req, res) {

    var user = req.session.user

    if (user) {
        const sql2 = "INSERT INTO tobInfo VALUES(?,?,?,?,?,?,?,?,?,?)"
        const sql1 = "SELECT * FROM tobInfo WHERE ID_VMS = '" + req.body.ID_VMS + "';";

        // tester si le ID n'existe pas 
        db.query(sql1, (err, result) => {

            if (err) {
                throw err;
            }
            // si les donn??es est vrais on enregistre la navire 
            if (result.length === 0) {
                const { error } = registerForm(req.body)

                if (error) {
                    return res.render('navire/ajouterNavire', { msg: error, user: user })
                } else {


                    db.query('SELECT * FROM tobInfo ORDER BY ID DESC LIMIT 1 ;', (err, result) => {
                        if (err) {
                            throw err;
                        }
                        var id, REG_ID
                        result.forEach(resultEelement => {
                            id = resultEelement['ID'] + 1
                            REG_ID = resultEelement['REG_ID'] + 1
                        });
                        db.query(sql2, [id, req.body.NA, req.body.ID_VMS, REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, testDate(req.body.DABEG, 0), testDate(req.body.DAEND, 0)], (err, result) => {
                            if (err) {
                                throw err;
                            }
                        });
                        return res.redirect('/home')
                    })

                }

            } else {
                msg = 'Votre ID VMS Est D??ja Utiliser'
                return res.render('navire/ajouterNavire', { msg: msg, user: user })
            }
        });
    } else {
        res.redirect('/')
    }
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//








//------------------------------------------------------- afficher tous les navires ----------------------------------------------------------------------//
navireRouter.get('/navires', function(req, res) {

    var user = req.session.user

    if (user) {
        db.query("SELECT * FROM tobInfo ORDER BY ID DESC ;", (err, result) => {
            if (err) {
                throw err;
            }
            return res.render('navire/touslesnavires', { navires: result, user: user });
        });
    } else {
        res.redirect('/')
    }
});



//--------------------------------------------------------------------------------------------------------------------------------------------------------//









//----------------------------------------------------------- modifier navire ---------------------------------------------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM tobInfo WHERE ID = ? "
        const msg = ""
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            var name
            result.forEach(navire => {
                name = navire['NA']
            });
            return res.render('navire/modifierNavire', { navireData: result, name: name, msg: msg, user: user })
        })
    } else {
        res.redirect('/')
    }

});



navireRouter.post('/modifier/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql1 = "SELECT * FROM tobInfo WHERE ID = " + req.params.id + ";"
        const sql2 = "UPDATE tobInfo SET NA = ?, REG_ID = ?, IMEI = ?, ICCID = ?, RC = ?, KEY_AES = ?, DABeg = ?, DAEnd = ? WHERE ID = ?"

        db.query(sql1, (err, result) => {
            if (err) {
                throw err
            }

            const { error } = registerForm(req.body)

            if (error) {

                var name
                result.forEach(navire => {
                    name = navire['NA']
                });
                return res.render('navire/modifierNavire', { navireData: result, name: name, msg: error, user: user })


            } else {
                var id, REG_ID
                result.forEach(resultEelement => {
                    id = resultEelement['ID']
                    REG_ID = resultEelement['REG_ID']
                });

                db.query(sql2, [req.body.NA, REG_ID, req.body.IMEI, req.body.ICCID, req.body.RC, req.body.KEY_AES, testDate(req.body.DABEG, 0), testDate(req.body.DAEND, 0), id], (err, result) => {
                    if (err) {
                        throw err
                    }
                })
                return res.redirect('/home')
            }

        })
    } else {
        res.redirect('/')
    }


});
//-------------------------------------------------------------------------------------------------------------------------------------------------------//









//--------------------------------------------------------------- supprimer navire ----------------------------------------------------------------------//

// GET method
navireRouter.get('/supprimer/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM tobInfo WHERE ID = ?"
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            return res.render('navire/validSupprission', { navire: result, user: user })
        })
    } else {
        res.redirect('/')
    }
});

// POST method
navireRouter.post('/supprimer/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM tobInfo WHERE ID = ?"
        db.query(sql, (req.params.id), (err, result) => {
            if (err) {
                throw err
            }
            const sqlDelete = "DELETE FROM tobInfo where id = ?"
            db.query(sqlDelete, (req.params.id), (err, result) => {
                if (err) {
                    throw err
                }
            })
        })
        return res.redirect('/home')
    } else {
        res.redirect('/')
    }


});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//








//---------------------------------------------------- afficher le compte de la navire  ------------------------------------------------------------------//

// la methode GET
navireRouter.get('/navire/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const id = "'" + req.params.id + "'"

        //les requetes SQL de la page
        //---------------------------------------------------------------------------------------------------------//
        sql1 = "SELECT * FROM tobInfo WHERE ID_VMS = " + id + ";";
        sql2 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE ID_VMS = " + id + ";";
        sql3 = "SELECT COUNT(*) AS TOTAL FROM trackingData WHERE ID_VMS = " + id + " AND TM LIKE '%DIS%';"
        sql4 = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKp%');"
        sql5 = "SELECT * FROM trackingData WHERE ID_VMS = " + id + " order by ID desc LIMIT 1;";
        sql6 = "SELECT * FROM weatherCRCData WHERE ID_VMS = " + id + " AND TM LIKE '%ACKp%' ORDER BY ID DESC LIMIT 1;"
        sql7 = "SELECT COUNT(*) AS TOTAL FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKb%');"

        //---------------------------------------------------------------------------------------------------------//

        // la concatination des requetes 
        sql = sql1 + sql2 + sql3 + sql4 + sql5 + sql6 + sql7
        db.query(sql, (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            // Configuration de la date et la position avec Moment.JS
            //----------------------------------------------------------//
            let dateDernierPosition, LT, LG, dateDernierMeteo, navireData

            //  extraire la date et la position
            // La Position 

            if (result[4].length > 0) {
                result[4].forEach(contenu => {
                    dateDernierPosition = moment(contenu['DA']).locale('fr').fromNow() // Configuration de la date et la position avec Moment.JS
                    LT = contenu['LT']
                    LG = contenu['LG']
                });
            }



            // La date
            if (result[5].length > 0) {
                // La date de la dernier meteo
                result[5].forEach(element => {
                    dateDernierMeteo = moment(element.DA).locale('fr').fromNow()
                });
            }

            //-----------------------------------------------------------//

            if (result[0].length > 0) {
                // la date de l'abonnement & le couleur de la validation 
                result[0].forEach(contenu => {
                    var date = contenu['DAEnd']
                    dateAbonnement = extraireDate(date)
                    resultatCouleur = validationAbonnement(dateAbonnement)
                });
            }

            // La verifications des donn??es 
            var nombrePositionEnvoyer = validationUndifined(result[1][0]['TOTAL'], 'Aucune position Envoyer')
            var nombreSOS = validationUndifined(result[2][0]['TOTAL'], "Aucune SOS Envoyer")
            var nombrePREV = validationUndifined(result[3][0]['TOTAL'], "Aucune Prevision envoyer")
            var nombreBMS = validationUndifined(result[6][0]['TOTAL'], "Aucune BMS envoyer")
            dateDernierPosition = validationUndifined(dateDernierPosition, "Aucune position envoyer")
            dateDernierMeteo = validationUndifined(dateDernierMeteo, "Aucune Meteo envoyer")
            LT = validationUndifined(LT, "Aucune")
            LG = validationUndifined(LG, "Aucune")


            // retourner les donn??es de la navire 
            result[0].forEach(contenu => {
                navireData = contenu
            });

            return res.render('navire/singleNavire', {
                navire: result[0],
                nombrePositionEnvoyer: nombrePositionEnvoyer,
                nombreSos: nombreSOS,
                nombrePREV: nombrePREV,
                nombreBMS: nombreBMS,
                dateDernierPosition: dateDernierPosition,
                position: { LT: LT, LG: LG },
                dateDernierMeteo: dateDernierMeteo,
                validationAbonnement: resultatCouleur[0]['couleur'],
                msgAbonnement: resultatCouleur[0]['msg'],
                user: user
            })
        });
    } else {
        res.redirect('/')
    }

});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//





//---------------------------------------------------- afficher l'historique de tracking  ------------------------------------------------------------------//

// la page des historiques 
navireRouter.get('/historique/:ID_VMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM trackingData WHERE ID_VMS = ? ORDER BY ID DESC"
        db.query(sql, (req.params.ID_VMS), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            return res.render('navire/historiqueTracking', { navire: result, ID_VMS: req.params.ID_VMS, user: user })
        })
    } else {
        res.redirect('/')
    }

});

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//







// ----------------------------------------------- afficher l'historique des positions, des SOS et des bulletins -----------------------------------------------------//




// Afficher les positions
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalposition/:ID_VMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const id = "'" + req.params.ID_VMS + "'"
        sql = "SELECT * FROM trackingData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%POS%') ORDER BY ID DESC ;";

        db.query(sql, (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            return res.render('navire/totalposition', { navirePositions: result, ID_VMS: id, user: user })
        })
    } else {
        res.redirect('/');
    }


});



// Afficher les SOS 
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalSOS/:ID_VMS', function(req, res) {
    var user = req.session.user

    if (user) {
        sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (TM LIKE '%DIS%') ORDER BY ID DESC ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            return res.render('navire/totalSOS', { navireSOS: result, ID_VMS: req.params.ID_VMS, user: user })
        })
    } else {
        res.redirect('/')
    }

});



// Afficher les Previsions
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalPrevision/:ID_VMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const id = "'" + req.params.ID_VMS + "'"
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKp%') ORDER BY ID DESC;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            // enregistrer le nom de la navire 

            return res.render('navire/totalPrev', { navireBulletins: result, ID_VMS: id, user: user })
        })
    } else {
        res.redirect('/')
    }
});




// Afficher les BMS 
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalBMS/:ID_VMS', function(req, res) {
    var user = req.session.user

    if (user) {
        const id = "'" + req.params.ID_VMS + "'"
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKb%') ORDER BY ID DESC ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }

            // enregistrer le nom de la navire 

            return res.render('navire/totalBMS', { navireBulletins: result, ID_VMS: id, user: user })
        })
    } else {
        res.redirect('/')
    }


});


//--------------------------------------------------------------------------------------------------------//







//----------------------------------------------------------------- Supprimer les positions de la navire -----------------------------------------------------------------//
// GET method
navireRouter.get('/supprimerPosition/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        return res.render('navire/validSupprission', { user: user })
    } else {
        res.redirect('/')
    }

});

// POST method
navireRouter.post('/supprimerPosition/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM trackingData WHERE ID = ?"
        db.query(sql, [req.params.id], (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            const sqlDelete = "DELETE FROM trackingData WHERE ID = ?"
            db.query(sqlDelete, (req.params.id), (err, result) => {
                if (err) {
                    throw err // remplacer par 404 NOT FOUND
                }
            })
        })
        return res.redirect('/home')
    } else {
        res.redirect('/')
    }
});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------//









//-------------------------------------------------------------- Supprimer les SOS de la navire ------------------------------------------------------------------------------//
// GET method
navireRouter.get('/supprimerSOS/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        return res.render('navire/validSupprission', { user: user })
    } else {
        res.redirect('/')
    }

});

// POST method
navireRouter.post('/supprimerSOS/:id', function(req, res) {
    var user = req.session.user

    if (user) {
        const sql = "SELECT * FROM trackingData WHERE ID = ?"
        db.query(sql, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
            const sqlDelete = "DELETE FROM trackingData where id = ?"
            db.query(sqlDelete, (req.params.id), (err, result) => {
                if (err) {
                    throw err // remplacer par 404 NOT FOUND
                }
            })
        })
        return res.redirect('/home')
    } else {
        res.redirect('/')
    }



});
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------------------- Recherche par picker------------------------------------------------------------------------------------------//

// la page picker 
navireRouter.get('/picker', function(req, res) {
    var user = req.session.user

    if (user) {
        sql = "SELECT * FROM tobInfo LIMIT 18"
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }

            return res.render('navire/picker', { navires: result, nombreDesNavire: result.length, user: user })

        })
    } else {
        res.redirect('/')
    }
});


// recherche par une seule date
navireRouter.get('/PickerSingleDate', function(req, res) {
    var user = req.session.user

    if (user) {
        const date = testDate(req.query.date, 0)
        const sql = "SELECT * FROM tobInfo WHERE ((DABeg =" + date + ") OR (DAEnd =" + date + ")) ORDER BY ID DESC ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            return res.render('navire/picker', { navires: result, nombreDesNavire: result.length, user: user })
        })
    } else {
        res.redirect('/')
    }


});



// recherche entre deux dates 
navireRouter.get('/PickerBetweenDate', function(req, res) {
    var user = req.session.user

    if (user) {
        const date1 = testDate(req.query.date1, 0)
        const date2 = testDate(req.query.date2, 0)
        const sql = "SELECT * FROM tobInfo where ((DABeg BETWEEN '" + date1 + "' AND '" + date2 + "') OR (DAEnd BETWEEN '" + date1 + "' AND '" + date2 + "')) ORDER BY ID DESC ;"
        db.query(sql, (err, result) => {
            if (err) {
                throw err;
            }
            return res.render('navire/picker', { navires: result, nombreDesNavire: result.length, user: user })
        })
    } else {
        res.redirect("/")
    }

});


// recherche par une requete
navireRouter.get('/PickerRequete', function(req, res) {
    var user = req.session.user

    if (user) {
        const search = req.query.recherche

        const sql = "SELECT * FROM tobInfo WHERE NA LIKE '%" + search + "%' OR ID_VMS LIKE '%" + search + "%' OR REG_ID LIKE '%" + search + "%' OR IMEI LIKE '%" + search + "%' OR RC LIKE '%" + search + "%' OR KEY_AES LIKE '%" + search + "%' OR DAEnd LIKE '%" + search + "%' ORDER BY ID DESC ;"

        db.query(sql, (err, result) => {
            if (err) {
                throw err
            }
            return res.render('navire/picker', { navires: result, nombreDesNavire: result.length, user: user })

        })
    } else {
        res.redirect('/')
    }


});


// Modifier les Positions d'une navire 
// La method GET
navireRouter.get('/modifierPosition/:ID', function(req, res) {
    var user = req.session.user
    if (user) {
        var sql = "SELECT * FROM trackingData WHERE ID = " + req.params.ID + ' ;'
        db.query(sql, (err, result) => {
            if (err) {
                throw err
            } else {
                if (result.length === 0) {
                    return res.redirect('/home')
                }
                return res.render('navire/modifierPosition', { positionData: result, user: user })
            }
        })
    } else {
        return res.redirect('/')
    }
});


// La method POST
navireRouter.post('/modifierPosition/:ID', function(req, res) {
    var user = req.session.user
    if (user) {
        var sql1 = "SELECT * FROM trackingData WHERE ID = " + req.params.ID + " ;"
        db.query(sql1, (err, result) => {
            if (err) {
                throw err
            }
            if (result.length === 0) {
                return res.redirect('/home')
            } else {
                const { error } = PositionForm(req.body)
                console.log(error)
                if (error) {
                    return res.render('navire/modifierPosition', { positionData: result, user: user, msg: error })
                } else {
                    var sql2 = "UPDATE trackingData SET NA = ?, ID_VMS = ?, RC = ?, DA = ?, TI = ?, LT = ?, LG = ?, CO = ?, SP = ?, COM = ?, TM = ?, IPADDRESS = ? WHERE ID = ? ;"
                    db.query(sql2, [result[0]['NA'], result[0]['ID_VMS'], result[0]['RC'], testDate(req.body.DA, 0), req.body.TI, req.body.LT, req.body.LG, req.body.CO, req.body.SP, req.body.COM, req.body.TM, req.body.IPADDRESS, req.params.ID], (err, result) => {
                        if (err) {
                            throw err;
                        }
                        return res.redirect('/home')
                    })
                }
            }
        })

    } else {
        return res.redirect('/')
    }
});





// l'exportation du module
module.exports = navireRouter;