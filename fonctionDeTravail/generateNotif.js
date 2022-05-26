function generatNotification() {
    const mysql = require('mysql');


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


    var sql = "SELECT * FROM VMS.trackingData T1 WHERE DATE_FORMAT(DA,'%Y%m%d')=DATE_FORMAT(20220418,'%Y%m%d') AND TI=(SELECT MAX(TI) FROM VMS.trackingData T2 WHERE (T1.NA=T2.NA AND T1.DA=T2.DA)) order by ID_VMS DESC; "
    db.query(sql, (err, result) => {
        if (err) {
            throw err
        }
        result.forEach(r => {
            var sql = "INSERT INTO notificationData (TYPE,DA,TI,NA,VU,ID_VMS) VALUES(?,?,?,?,?,?);"
            db.query(sql, [r['TM'], r['DA'], r['TI'], r['NA'], 0, r['ID_VMS']], (err, result) => {
                if (err) {
                    throw err;
                }
            })
        });

    })

}


module.exports = generatNotification;