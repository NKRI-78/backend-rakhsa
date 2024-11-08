const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, name, path, created_at FROM banners`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, name, path) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO banners (uid, name, path) 
            VALUES ('${id}', '${name}', '${path}') ON DUPLICATE KEY UPDATE 
            name = '${name}', path = '${path}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, name, path FROM banners WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM banners WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}