const conn = require('../configs/db')

module.exports = {

    list: (type, platformType) => {
        return new Promise((resolve, reject) => {
            var query

            if(type == "live") {
                query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                INNER JOIN platforms p ON p.id = s.platform_type
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE s.sos_activity_type IN (1, 2, 3) 
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            }

            // if(type == "recently") {
            //     query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
            //     FROM sos s
            //     INNER JOIN sos_types st ON st.id = s.sos_type
            //     INNER JOIN platforms p ON p.id = s.platform_type
            //     INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
            //     WHERE s.sos_activity_type = 2
            //     AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            // }

            // if(type == "process") {
            //     query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
            //     FROM sos s
            //     INNER JOIN sos_types st ON st.id = s.sos_type
            //     INNER JOIN platforms p ON p.id = s.platform_type
            //     INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
            //     WHERE s.sos_activity_type = 1
            //     AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            // }

            if(type == "resolved") {
                query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                INNER JOIN platforms p ON p.id = s.platform_type
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE s.sos_activity_type = 4
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            }

            if(type == "closed") {
                query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                INNER JOIN platforms p ON p.id = s.platform_type
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE s.sos_activity_type = 5
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'`
            }

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    rating: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT sr.rate, p.fullname 
            FROM sos_ratings sr 
            INNER JOIN profiles p ON p.user_id = sr.user_id 
            WHERE sr.sos_id = ?`
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, s.location, s.agent_note, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
                FROM sos s 
                INNER JOIN sos_types st ON st.id = s.sos_type
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE uid = ?
            `
            conn.query(query, [id], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT user_id, user_agent_id FROM sos WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    ratingSos: (sosId, rate, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO sos_ratings (sos_id, rate, user_id) 
            VALUES (?, ?, ?)`
            conn.query(query, [sosId, rate, userId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    resolveSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET sos_activity_type = 4 WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    closeSos: (sosId, note) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET sos_activity_type = 5, agent_note = ? WHERE uid = ?`
            conn.query(query, [note, sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    moveSosToRecently: (sosId) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE sos SET sos_activity_type = 2 WHERE uid = ?`

            conn.query(query, [sosId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkExpireSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid FROM sos WHERE uid = ? 
            AND sos_activity_type = 6`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    expireSos: (sosId) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE sos SET sos_activity_type = 6
            WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}