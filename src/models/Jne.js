const conn = require('../configs/db')

module.exports = {

    getOriginJneByCity: (city) => {
        var query = `SELECT * FROM origin_jnes WHERE origin_name LIKE '%${city}%'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}