const express = require('express');
const mysql = require('mysql');
const moment = require('moment');
const validationAbonnement = require('../fonctionDeTravail/validationAbonnement');
const extraireDate = require('../fonctionDeTravail/extraireDate');
const validationUndifined = require('../fonctionDeTravail/validationUndifined');
const testDate = require('../fonctionDeTravail/testDate');
const navireRouter = express.Router();
const { registerForm } = require('../fonctionDeTravail/validationJoi');




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
    var msg = ''
    return res.render('navire/ajouterNavire', { msg })
});

// POST method
navireRouter.post('/ajouter', function(req, res) {


    const sql2 = "INSERT INTO tobInfo VALUES(?,?,?,?,?,?,?,?,?,?)"
    const sql1 = "SELECT * FROM tobInfo WHERE ID_VMS = '" + req.body.ID_VMS + "';";

    // tester si le ID n'existe pas 
    db.query(sql1, (err, result) => {

        if (err) {
            throw err;
        }
        // si les données est vrais on enregistre la navire 
        if (result.length === 0) {
            const { error } = registerForm(req.body)

            if (error) {
                return res.render('navire/ajouterNavire', { msg: error })
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
                    return res.redirect('/navire/navires')
                })

            }

        } else {
            msg = 'Votre ID VMS Est Déja Utiliser'
            return res.render('navire/ajouterNavire', { msg: msg })
        }
    });
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//








//------------------------------------------------------- afficher tous les navires ----------------------------------------------------------------------//
navireRouter.get('/navires', function(req, res) {

    db.query("SELECT * FROM tobInfo ORDER BY ID DESC LIMIT 10;", (err, result) => {
        if (err) {
            throw err; // remplacer par 404 NOT FOUND
        }
        return res.render('navire/touslesnavires', { navires: result });
    });

});



// la fonction de pagination de la page navire 
navireRouter.get('/paginationNavires', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM tobInfo ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM tobInfo ORDER BY ID DESC LIMIT " + pagination + ";"
    }

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render('navire/touslesnavires', { navires: result })
    })
});

//--------------------------------------------------------------------------------------------------------------------------------------------------------//







//------------------------------------------------------------- le fonctionement de la bar de recherche --------------------------------------------------//

// la fonction recherche de la page navire
navireRouter.get('/recherche', function(req, res) {

    const search = req.query.recherche

    const sql = "SELECT * FROM tobInfo WHERE NA LIKE '%" + search + "%' OR ID_VMS LIKE '%" + search + "%' OR REG_ID LIKE '%" + search + "%' OR IMEI LIKE '%" + search + "%' OR RC LIKE '%" + search + "%' OR KEY_AES LIKE '%" + search + "%' OR DAEnd LIKE '%" + search + "%';"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        return res.render('navire/touslesnavires', { navires: result })
    })

});


// la fonction recherche de la page tracking 
navireRouter.get('/:ID_VMS/rechercheTracking', function(req, res) {
    const search = req.query.recherche
    const sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR LT LIKE '%" + search + "%' OR LG LIKE '%" + search + "%' OR CO LIKE '%" + search + "%' OR SP LIKE '%" + search + "%' OR COM LIKE '%" + search + "%' OR TM LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') LIMIT 20;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render('navire/historiqueTracking', { navire: result, ID_VMS: req.params.ID_VMS })
    })
});

// la fonction recherche de la page historique des positions
navireRouter.get('/:ID_VMS/recherchePosition', function(req, res) {
    const search = req.query.recherche
    const sql = "SELECT * FROM trackingData WHERE (ID_VMS = " + req.params.ID_VMS + ") AND (TM = 'POS') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR LT LIKE '%" + search + "%' OR LG LIKE '%" + search + "%' OR CO LIKE '%" + search + "%' OR SP LIKE '%" + search + "%' OR COM LIKE '%" + search + "%' OR TM LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') LIMIT 20;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        return res.render('navire/totalposition', { navirePositions: result, ID_VMS: req.params.ID_VMS })
    })
});



// la fonction recherche de la page historique des SOS
navireRouter.get('/:ID_VMS/rechercheSOS', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (TM = 'DIS') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR LT LIKE '%" + search + "%' OR LG LIKE '%" + search + "%' OR CO LIKE '%" + search + "%' OR SP LIKE '%" + search + "%' OR COM LIKE '%" + search + "%' OR TM LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') LIMIT 20;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        return res.render('navire/totalSOS', { navireSOS: result, ID_VMS: req.params.ID_VMS })
    })
});



// la fonction recherche de la page historique des bulletins
navireRouter.get('/:ID_VMS/recherchePrev', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM weatherCRCData where (ID_VMS = " + req.params.ID_VMS + ") AND (TM = 'ACKp') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR TM = '" + search + "' OR CRC LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') ORDER BY ID DESC;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render('navire/totalPrev', { navireBulletins: result, ID_VMS: req.params.ID_VMS })
    })
});


// la fonction recherche de la page historique des bulletins
navireRouter.get('/:ID_VMS/rechercheBMS', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM weatherCRCData where (ID_VMS = " + req.params.ID_VMS + ") AND (TM = 'ACKb') AND (DA LIKE '%" + search + "%' OR TI LIKE '%" + search + "%' OR TM = '" + search + "' OR CRC LIKE '%" + search + "%' OR IPADDRESS LIKE '%" + search + "%') ORDER BY ID DESC ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render('navire/totalBMS', { navireBulletins: result, ID_VMS: req.params.ID_VMS })
    })
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//






//----------------------------------------------------------- modifier navire ---------------------------------------------------------------------------//
// GET method
navireRouter.get('/modifier/:id', function(req, res) {
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
        return res.render('navire/modifierNavire', { navireData: result, name: name, msg: msg })
    })

});



navireRouter.post('/modifier/:id', function(req, res) {
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
            return res.render('navire/modifierNavire', { navireData: result, name: name, msg: error })


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
            return res.redirect('/navire/navires')
        }

    })
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------//









//--------------------------------------------------------------- supprimer navire ----------------------------------------------------------------------//

// GET method
navireRouter.get('/supprimer/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo WHERE ID = ?"
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }
        return res.render('navire/validSupprission', { navire: result })
    })

});

// POST method
navireRouter.post('/supprimer/:id', function(req, res) {
    const sql = "SELECT * FROM tobInfo WHERE ID = ?"
    db.query(sql, (req.params.id), (err, result) => {
        if (err) {
            throw err
        }
        const sqlDelete = "DELETE FROM tobInfo where id = ?"
        db.query(sqlDelete, (req.params.id), (err, result) => {
            if (err) {
                throw err // remplacer par 404 NOT FOUND
            }
        })
    })
    return res.redirect('/navire/navires')
});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//








//---------------------------------------------------- afficher le compte de la navire  ------------------------------------------------------------------//

// la methode GET
navireRouter.get('/navire/:id', function(req, res) {

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

        // La verifications des données 
        var nombrePositionEnvoyer = validationUndifined(result[1][0]['TOTAL'], 'Aucune position Envoyer')
        var nombreSOS = validationUndifined(result[2][0]['TOTAL'], "Aucune SOS Envoyer")
        var nombrePREV = validationUndifined(result[3][0]['TOTAL'], "Aucune Prevision envoyer")
        var nombreBMS = validationUndifined(result[6][0]['TOTAL'], "Aucune BMS envoyer")
        dateDernierPosition = validationUndifined(dateDernierPosition, "Aucune position envoyer")
        dateDernierMeteo = validationUndifined(dateDernierMeteo, "Aucune Meteo envoyer")
        LT = validationUndifined(LT, "Aucune")
        LG = validationUndifined(LG, "Aucune")


        // retourner les données de la navire 
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
            msgAbonnement: resultatCouleur[0]['msg']
        })
    });

});
//--------------------------------------------------------------------------------------------------------------------------------------------------------//





//---------------------------------------------------- afficher l'historique de tracking  ------------------------------------------------------------------//

// la page des historiques 
navireRouter.get('/historique/:ID_VMS', function(req, res) {
    const sql = "SELECT * FROM trackingData WHERE ID_VMS = ? ORDER BY ID DESC LIMIT 10"
    db.query(sql, (req.params.ID_VMS), (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        return res.render('navire/historiqueTracking', { navire: result, ID_VMS: req.params.ID_VMS })
    })
});

// pagination de la page historique de tracking
navireRouter.get('/:ID_VMS/paginationHistorique', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM trackingData WHERE ID_VMS = '" + req.params.ID_VMS + "' ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM trackingData WHERE ID_VMS = '" + req.params.ID_VMS + "' ORDER BY ID DESC LIMIT " + pagination + ";"
    }
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/historiqueTracking', { navire: result, ID_VMS: req.params.ID_VMS })
    })
});
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------//







// ----------------------------------------------- afficher l'historique des positions, des SOS et des bulletins -----------------------------------------------------//




// Afficher les positions
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalposition/:ID_VMS', function(req, res) {
    const id = "'" + req.params.ID_VMS + "'"
    sql = "SELECT * FROM trackingData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%POS%') ORDER BY ID DESC LIMIT 10;";

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        return res.render('navire/totalposition', { navirePositions: result, ID_VMS: id })
    })
});


// pagination de la page historique des positions
navireRouter.get('/:ID_VMS/paginationPosition', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM trackingData WHERE ID_VMS = " + req.params.ID_VMS + " ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM trackingData WHERE ID_VMS = " + req.params.ID_VMS + " ORDER BY ID DESC LIMIT " + pagination + ";"
    }

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/totalposition', { navirePositions: result, ID_VMS: req.params.ID_VMS })
    })
});
//------------------------------------------------------------------------------------------------//



// Afficher les SOS 
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalSOS/:ID_VMS', function(req, res) {
    sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (TM LIKE '%DIS%') ORDER BY ID DESC LIMIT 10;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        return res.render('navire/totalSOS', { navireSOS: result, ID_VMS: req.params.ID_VMS })
    })
});


// pagination de la page historique des SOS
navireRouter.get('/:ID_VMS/paginationSOS', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (TM LIKE '%DIS%') ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM trackingData WHERE (ID_VMS = '" + req.params.ID_VMS + "') AND (TM LIKE '%DIS%') ORDER BY ID DESC LIMIT " + pagination + ";"
    }

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/totalSOS', { navireSOS: result, ID_VMS: req.params.ID_VMS })
    })
});
//------------------------------------------------------------------------------------------------//




// Afficher les Previsions
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalPrevision/:ID_VMS', function(req, res) {
    const id = "'" + req.params.ID_VMS + "'"
    sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKp%') ORDER BY ID DESC LIMIT 10;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        // enregistrer le nom de la navire 

        return res.render('navire/totalPrev', { navireBulletins: result, ID_VMS: id })
    })
});

// pagination de la page historique des Previsions
navireRouter.get('/:ID_VMS/paginationPrev', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + req.params.ID_VMS + ") AND (TM LIKE '%ACKp%') ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + req.params.ID_VMS + ") AND (TM LIKE '%ACKp%') ORDER BY ID DESC LIMIT " + pagination + ";"

    }

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/totalPrev', { navireBulletins: result, ID_VMS: req.params.ID_VMS })
    })
});


// Afficher les BMS 
//------------------------------------------------------------------------------------------------//
navireRouter.get('/totalBMS/:ID_VMS', function(req, res) {
    const id = "'" + req.params.ID_VMS + "'"
    sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + id + ") AND (TM LIKE '%ACKb%') ORDER BY ID DESC LIMIT 10;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err // remplacer par 404 NOT FOUND
        }

        // enregistrer le nom de la navire 

        return res.render('navire/totalBMS', { navireBulletins: result, ID_VMS: id })
    })
});

// pagination de la page historique des BMS
navireRouter.get('/:ID_VMS/paginationBMS', function(req, res) {
    const pagination = req.query.pagination
    var sql
    if (pagination === "TOUS") {
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + req.params.ID_VMS + ") AND (TM LIKE '%ACKb%') ORDER BY ID DESC ;"
    } else {
        sql = "SELECT * FROM weatherCRCData WHERE (ID_VMS = " + req.params.ID_VMS + ") AND (TM LIKE '%ACKb%') ORDER BY ID DESC LIMIT " + pagination + ";"

    }

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/totalBMS', { navireBulletins: result, ID_VMS: req.params.ID_VMS })
    })
});

//--------------------------------------------------------------------------------------------------------//







//----------------------------------------------------------------- Supprimer les positions de la navire -----------------------------------------------------------------//
// GET method
navireRouter.get('/supprimerPosition/:id', function(req, res) {
    return res.render('navire/validSupprission')
});

// POST method
navireRouter.post('/supprimerPosition/:id', function(req, res) {
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
    return res.redirect('/navire/navires')

});
//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------//









//-------------------------------------------------------------- Supprimer les SOS de la navire ------------------------------------------------------------------------------//
// GET method
navireRouter.get('/supprimerSOS/:id', function(req, res) {
    return res.render('navire/validSupprission')
});

// POST method
navireRouter.post('/supprimerSOS/:id', function(req, res) {
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
    return res.redirect('/navire/navires')

});
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------//



//-------------------------------------------------------------- Recherche par picker------------------------------------------------------------------------------------------//

// la page picker 
navireRouter.get('/picker', function(req, res) {
    sql = "SELECT * FROM tobInfo LIMIT 18"
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }

        return res.render('navire/picker', { navires: result, nombreDesNavire: result.length })

    })
});

// recherche par une seule date
navireRouter.get('/PickerSingleDate', function(req, res) {
    const date = testDate(req.query.date, 0)
    const sql = "SELECT * FROM tobInfo WHERE ((DABeg =" + date + ") OR (DAEnd =" + date + ")) ORDER BY ID DESC ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        return res.render('navire/picker', { navires: result, nombreDesNavire: result.length })
    })
});

// recherche entre deux dates 
navireRouter.get('/PickerBetweenDate', function(req, res) {
    const date1 = testDate(req.query.date1, 0)
    const date2 = testDate(req.query.date2, 0)
    const sql = "SELECT * FROM tobInfo where ((DABeg BETWEEN '" + date1 + "' AND '" + date2 + "') OR (DAEnd BETWEEN '" + date1 + "' AND '" + date2 + "')) ORDER BY ID DESC ;"
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        return res.render('navire/picker', { navires: result, nombreDesNavire: result.length })
    })

});


// recherche par une requete
navireRouter.get('/PickerRequete', function(req, res) {
    const search = req.query.recherche

    const sql = "SELECT * FROM tobInfo WHERE NA LIKE '%" + search + "%' OR ID_VMS LIKE '%" + search + "%' OR REG_ID LIKE '%" + search + "%' OR IMEI LIKE '%" + search + "%' OR RC LIKE '%" + search + "%' OR KEY_AES LIKE '%" + search + "%' OR DAEnd LIKE '%" + search + "%' ORDER BY ID DESC ;"

    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        return res.render('navire/picker', { navires: result, nombreDesNavire: result.length })

    })
});


// l'exportation du module
module.exports = navireRouter;