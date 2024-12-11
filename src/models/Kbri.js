const conn = require('../configs/db')

module.exports = {

    userKbri: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT c.name AS continent_name 
            FROM user_kbris uk
            INNER JOIN continents c ON uk.continent_id = c.id
            WHERE uk.user_id = ?`
            conn.query(query, [userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    infoKbri: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT title, img, description, lat, lng, address, emergency_call 
            FROM kbris WHERE id = ?`
            conn.query(query, [id], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })  
        })
    },

    infoVisaContent: (stateId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT content 
            FROM visa_contents 
            WHERE state_id = ?`
            conn.query(query, [stateId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })  
        })
    },

    infoPassportContent: (stateId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT content 
            FROM passport_contents 
            WHERE state_id = ?`
            conn.query(query, [stateId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })  
        })
    },

    infoKbriByState: (stateId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT k.title, k.img, k.description, k.lat, k.lng, k.address, k.emergency_call, s.name AS state_name
            FROM kbris k
            INNER JOIN states s ON s.id = k.state_id
            WHERE k.state_id = ?`
            conn.query(query, [stateId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })  
        })
    },

    formKbri: (title, img, description, lat, lng, address, stateId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO kbris (title, img, description, lat, lng, address, state_id) VALUES (?, ?, ?, ?, ?, ?, ?)`
            conn.query(query, [title, img, description, lat, lng, address, stateId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })  
        })
    },

}