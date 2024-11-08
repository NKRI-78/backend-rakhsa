const conn = require('../configs/db')

module.exports = {

    continents: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, name FROM continents`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    states: (continentId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT name FROM states 
            WHERE continent_id = '${continentId}'`
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