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

    countries: (search) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM states WHERE name LIKE '%${search}%'`
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
            var query = `SELECT s.id, s.name FROM states s 
            INNER JOIN continents c ON c.id = s.continent_id 
            WHERE s.continent_id = ?`
            conn.query(query, [continentId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    cities: (continentId, stateId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, name FROM cities
                WHERE continent_id = ?
                AND state_id = ?
            `
            conn.query(query, [continentId, stateId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {    
                    resolve(result)
                }
            })
        })
    }

}