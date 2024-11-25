const conn = require('../configs/db')

module.exports = {

    list: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT i.id, i.title, i.description, 
            i.start_date, i.end_date, stat.name AS state_name, 
            con.name AS continent_name, i.user_id
            FROM itineraries i
            INNER JOIN continents con ON con.id = i.continent_id 
            INNER JOIN states stat ON stat.id = i.state_id
            INNER JOIN profiles p ON p.user_id = i.user_id
            ` 
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }, 

    listEventUser: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT i.id, i.title, i.description, 
            i.start_date, i.end_date, stat.name AS state_name, 
            con.name AS continent_name, i.user_id
            FROM itineraries i
            INNER JOIN continents con ON con.id = i.continent_id 
            INNER JOIN states stat ON stat.id = i.state_id
            INNER JOIN profiles p ON p.user_id = i.user_id
            WHERE i.user_id = ?
            ` 
            conn.query(query, [userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }, 

    find: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT i.id, i.title, i.description, i.continent_id, i.state_id, i.start_date, i.end_date,
            stat.id AS state_id,
            stat.name AS state_name, 
            con.name AS continent_name, 
            con.id AS continent_id,
            i.user_id
            FROM itineraries i
            INNER JOIN continents con ON con.id = i.continent_id 
            INNER JOIN states stat ON stat.id = i.state_id
            INNER JOIN profiles p ON p.user_id = i.user_id
            WHERE i.id = ?`
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM itineraries WHERE id = ?`
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })  
    },

    store: (title, startDate, endDate, continentId, stateId, description, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO itineraries (title, start_date, end_date, 
                continent_id, state_id, description, user_id
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)`
            conn.query(query, [title, startDate, endDate, continentId, stateId, description, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    update: (id, title, startDate, endDate, continentId, stateId, description) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE itineraries SET title = ?, start_date = ?, end_date = ?, continent_id = ?, state_id = ?, description = ?
                WHERE id = ?
            `
            conn.query(query, [title, startDate, endDate, continentId, stateId, description, id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }
    

}