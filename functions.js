const mysql = require('mysql')

const connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'registrogrest'
});

doQuery = function (query, values) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (err, res, fields) => {
            if (res.length > 0) return resolve(res[0])
            else return reject(err)
        })
    })
}

module.exports = { doQuery }