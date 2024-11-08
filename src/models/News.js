const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, title, image, description, created_at FROM news ORDER BY id DESC`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkNews: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT title FROM news WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, title, desc, image) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO news (uid, title, description, image) 
            VALUES ('${id}', '${title}', '${desc}', '${image}')
            ON DUPLICATE KEY UPDATE title = '${title}', description = '${desc}', image = '${image}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertImg: (id, newsId, path) => { 
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO news_images (uid, news_id, path) VALUES ('${id}', '${newsId}', '${path}') 
            ON DUPLICATE KEY UPDATE path = '${path}'`
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
            var query = `SELECT uid, title, image, description, created_at FROM news WHERE uid = '${id}'`
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
            var query = `DELETE FROM news WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
     
}

