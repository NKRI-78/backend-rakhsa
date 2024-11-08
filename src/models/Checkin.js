const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT c.uid, c.title, c.description, c.location, c.lat, c.lng, c.start, c.end, p.user_id, p.avatar, p.fullname, c.checkin_date 
            FROM checkins c 
            INNER JOIN profiles p ON c.user_id = p.user_id
            ORDER BY c.created_at DESC`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detail: (checkin_id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT c.uid, c.title, c.description, c.location, c.lat, c.lng, c.start, c.end, p.user_id, p.avatar, p.fullname, c.checkin_date 
            FROM checkins c 
            INNER JOIN profiles p ON c.user_id = p.user_id 
            WHERE c.uid = '${checkin_id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, title, desc, location, lat, lng, start, end, user_id, checkin_date) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO checkins (uid, title, description, location, lat, lng, start, end, user_id, checkin_date) 
            VALUES ('${id}', '${title}', '${desc}', '${location}', '${lat}', '${lng}', '${start}', '${end}', '${user_id}', '${checkin_date}') ON DUPLICATE KEY UPDATE 
            title = '${title}', description = '${desc}', location = '${location}', lat = '${lat}', lng = '${lng}', start = '${start}', end = '${end}', checkin_date = '${checkin_date}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    join: (id, checkin_id, user_id) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO checkin_joins (uid, checkin_id, user_id) 
            VALUES ('${id}', '${checkin_id}', '${user_id}')`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkUserJoin: (checkin_id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT c.user_id, p.fullname, p.avatar FROM checkin_joins c
            INNER JOIN profiles p ON c.user_id = p.user_id
            WHERE c.checkin_id = '${checkin_id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkSelfJoin: (checkin_id, user_id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT c.user_id, p.fullname, p.avatar FROM checkin_joins c
            INNER JOIN profiles p ON c.user_id = p.user_id
            WHERE c.checkin_id = '${checkin_id}' AND c.user_id = '${user_id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkCheckin: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT description FROM checkins WHERE uid = '${id}'`
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
            var query = `DELETE FROM checkins WHERE uid = '${id}'`
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