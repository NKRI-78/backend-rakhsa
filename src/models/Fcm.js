const conn = require('../configs/db')
const connPPOB = require('../configs/db_ppob')

module.exports = {

    init: (token, lat, lng, user_id) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO fcms (token, lat, lng, user_id) 
            VALUES ('${token}', '${lat}', '${lng}', '${user_id}') 
            ON DUPLICATE KEY UPDATE token = '${token}', lat = '${lat}', lng = '${lng}', updated_at = NOW()`

            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    users: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT u.uid, f.token
            FROM fcms f 
            LEFT JOIN users u ON f.user_id = u.uid`

            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    fcm: (userId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT f.token, u.email, u.phone, 
            p.fullname, p.avatar, f.lat, f.lng, f.token 
            FROM fcms f
            INNER JOIN profiles p ON p.user_id = f.user_id
            INNER JOIN users u ON u.uid = f.user_id
            WHERE f.user_id = '${userId}'`

            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    fcmPPOB: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT token, origin, user_id 
            FROM fcms WHERE user_id = '${userId}'`

            connPPOB.query(query, (error, result) => {
                if(error) {
                    reject(new Error(error))
                } else {
                    resolve(result)
                }
            })
        });
    },

    userLatLng: (userId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT f.token, u.uid AS user_id, u.email, u.phone, 
            p.fullname, p.avatar, f.lat, f.lng, f.token 
            FROM fcms f
            INNER JOIN profiles p ON p.user_id = f.user_id
            INNER JOIN users u ON u.uid = f.user_id
            WHERE f.user_id != '${userId}'`

            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    userLatLngPagination: (offset, limit, lat, lng, userId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT 
                f.token, 
                u.email, 
                u.phone, 
                p.fullname, 
                p.avatar, 
                f.lat, 
                f.lng,
                (
                    6371 * acos(
                        cos(radians(${lat})) * 
                        cos(radians(f.lat)) * 
                        cos(radians(f.lng) - radians(${lng})) + 
                        sin(radians(${lat})) * 
                        sin(radians(f.lat))
                    )
                ) AS distance
                FROM 
                    fcms f
                INNER JOIN 
                    profiles p ON p.user_id = f.user_id
                INNER JOIN 
                    users u ON u.uid = f.user_id
                WHERE 
                    f.user_id != '${userId}'
                HAVING 
                    distance < 10
                ORDER BY 
                    distance
                LIMIT ${offset}, ${limit};
            `
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