const conn = require('../configs/db')

module.exports = {

    list: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, title, img, description, created_at, updated_at FROM news`
            conn.query(query, (e, result) => {
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
            var query = `SELECT id, title, img, description, created_at 
            FROM news WHERE id = ?`
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
            var query = `DELETE FROM news 
            WHERE id = ?`
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insert: (title, img, desc) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO news (title, img, description) VALUES (?, ?, ?)`
            conn.query(query, [title, img, desc], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    update: (id, title, desc) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE news SET title = ?, description = ? WHERE id = ?`
            conn.query(query, [title, desc, id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateImage: (id, img) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE news SET img = ? WHERE id = ?`
            conn.query(query, [img, id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}