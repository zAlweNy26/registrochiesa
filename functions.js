const mysql = require('mysql')

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'registrogrest'
});

doQuery = function (query, values = '') {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, res, fields) => {
            if (err) return reject(err)
            if (res.length == 1) return resolve(res[0])
            else if (res.length > 0) return resolve(res)
            else return reject(0)
        })
    })
}

module.exports = { doQuery }