const conn = require('../configs/db')

module.exports = {


    list: (type, lat, lng, isAdmin) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT n.id, n.title, n.img, n.description, 
                COALESCE(n.lat, '-') AS lat, 
                COALESCE(n.lng, '-') AS lng, 
                nt.name AS news_type, 
                CONCAT(
                    ROUND(
                        6371 * acos(
                            cos(radians(${lat})) * cos(radians(n.lat)) * cos(radians(n.lng) - radians(${lng})) +
                            sin(radians(${lat})) * sin(radians(n.lat))
                        ), 2
                    ), 
                    ' KM'
                ) AS distance,
                n.created_at, 
                n.updated_at
                FROM news n 
                INNER JOIN news_types nt ON nt.id = n.type
                WHERE n.type = ?
                AND (
                    6371 * acos(
                        cos(radians(?)) * cos(radians(n.lat)) * cos(radians(n.lng) - radians(?)) + sin(radians(?)) * sin(radians(n.lat))
                    )
                ) <= 3
            `

            var values = []

            if(isAdmin == "true" && type == "news") {
                query = `SELECT n.id, n.title, n.img, n.description, 
                    COALESCE(n.lat, '-') AS lat, 
                    COALESCE(n.lng, '-') AS lng, 
                    nt.name AS news_type, 
                    n.created_at, 
                    n.updated_at
                    FROM news n 
                    INNER JOIN news_types nt ON nt.id = n.type
                    WHERE n.type = ?
                `
                var values = [2]
            } else if(isAdmin == "true" && type == "ews") {
                query = `SELECT n.id, n.title, n.img, n.description, 
                    COALESCE(n.lat, '-') AS lat, 
                    COALESCE(n.lng, '-') AS lng, 
                    nt.name AS news_type, 
                    n.created_at, 
                    n.updated_at
                    FROM news n 
                    INNER JOIN news_types nt ON nt.id = n.type
                    WHERE n.type = ?
                `
                var values = [1]
            } else {
                values = [1, lat, lng, lat]
            }

            conn.query(query, values, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkEws: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, TIMESTAMPDIFF(HOUR, created_at, NOW()) AS difference FROM news WHERE type = 1`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteEws: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM news WHERE id = ?`
            conn.query(query, [id], (e, result) => {
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
            var query = `SELECT id, title, img, description, COALESCE(lat, '-') AS lat, COALESCE(lng, '-') AS lng, created_at 
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

    insert: (title, img, desc, lat, lng, type) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO news (title, img, description, lat, lng, type) VALUES (?, ?, ?, ?, ?, ?)`
            conn.query(query, [title, img, desc, lat, lng, type == "news" ? 2 : 1], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    update: (id, title, desc, lat, lng) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE news SET title = ?, description = ?, lat = ?, lng = ? WHERE id = ?`
            conn.query(query, [title, desc, lat, lng, id], (e, result) => {
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