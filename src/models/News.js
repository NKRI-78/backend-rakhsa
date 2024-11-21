const conn = require('../configs/db')

module.exports = {

    list: (type) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT n.id, n.title, n.img, n.description, nt.name AS news_type, n.created_at, n.updated_at 
            FROM news n 
            INNER JOIN news_types nt ON nt.id = n.type
            WHERE n.type = ?`
            conn.query(query, [type == "news" ? 2 : 1], (e, result) => {
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

    insert: (title, img, desc, type) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO news (title, img, description, type) VALUES (?, ?, ?, ?)`
            conn.query(query, [title, img, desc, type == "news" ? 2 : 1], (e, result) => {
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