const conn = require('../configs/db')

const connSaka = require('../configs/db_saka')

module.exports = {

    all: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, picture, title, description, is_paid, location, start, end, date, created_at FROM events 
            ORDER BY created_at DESC`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },  

    getEventSaka: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT * FROM events LEFT JOIN media ON events.picture = media.media_id 
            WHERE events.status != false 
            ORDER BY events.created DESC`
            
            connSaka.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getEventJoinSaka: (eventId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT 
			a.id, b.user_id, b.fullname, b.profile_pic, c.description as event_name, d.phone_number, d.email_address, a.present,
			a.created, a.updated
            FROM event_joins a 
            LEFT JOIN profiles b ON a.user_id = b.user_id
            LEFT JOIN events c ON a.event_id = c.event_id
            LEFT JOIN users d ON a.user_id = d.user_id 
            WHERE a.event_id = '${eventId}'`
            
            connSaka.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMediaSaka: (mediaId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT path FROM media 
            WHERE media_id = '${mediaId}'`
            
            connSaka.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkEvents: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT title FROM events WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkEventSelfJoin: (userId, eventId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT ej.user_id, p.fullname, p.avatar FROM event_joins ej
            INNER JOIN profiles p ON p.user_id = ej.user_id
            WHERE ej.user_id = '${userId}' 
            AND ej.event_id = '${eventId}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkEventJoin: (eventId) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT ej.user_id, p.fullname, p.avatar FROM event_joins ej
            INNER JOIN profiles p ON p.user_id = ej.user_id
            WHERE ej.event_id = '${eventId}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    joinEvent: (id, userId, eventId) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO event_joins (uid, user_id, event_id) VALUES ('${id}', '${userId}', '${eventId}')`
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
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, picture, title, description, is_paid, start, end, location, date, created_at FROM events
            WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, picture, title, desc, date, start, end, location, paid) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO events (uid, picture, title, description, date, start, end, location, is_paid) 
                VALUES ('${id}', '${picture}', '${title}', '${desc}', '${date}', '${start}', '${end}', '${location}', '${paid}') 
                ON DUPLICATE KEY UPDATE picture = '${picture}', title = '${title}', description = '${desc}', 
                date = '${date}', start = '${start}', end = '${end}', location = '${location}', is_paid = '${paid}'`
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
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM events WHERE uid = '${id}'`
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