const conn = require('../configs/db')

module.exports = {

    badgeLive: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
                sos_activity_type AS sos_type,
                COUNT(*) AS count
            FROM 
                sos
            WHERE 
                sos_activity_type IN (1, 2, 3)`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    badgeResolved: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
                sos_activity_type AS sos_type,
                COUNT(*) AS count
            FROM 
                sos
            WHERE 
                sos_activity_type IN (4)`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    badgeClosed: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
                sos_activity_type AS sos_type,
                COUNT(*) AS count
            FROM 
                sos
            WHERE 
                sos_activity_type IN (5, 6)`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkAlreadyConfirmed: (userId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT id FROM sos WHERE sos_activity_type = 3 AND user_id = ?`

            conn.query(query, [userId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

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
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'
                ORDER BY s.created_at DESC`
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
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'
                ORDER BY s.created_at DESC`
            }

            if(type == "closed") {
                query = `SELECT s.uid, s.location, p.name AS platform, s.created_at, s.media, st.name AS type, s.lat, s.lng, s.country, sat.name AS status, s.time, s.user_id, s.user_agent_id
                FROM sos s
                INNER JOIN sos_types st ON st.id = s.sos_type
                INNER JOIN platforms p ON p.id = s.platform_type
                INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type
                WHERE s.sos_activity_type IN(5, 6)
                AND s.platform_type = '${platformType == 'raksha' ? 1 : 2}'
                ORDER BY s.created_at DESC`
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
            var query = `SELECT uid FROM sos WHERE uid = ?`
            conn.query(query, [sosId], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    moveSosToClosed: (sosId) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE sos SET sos_activity_type = 5 WHERE uid = ?`

            conn.query(query, [sosId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateExpireMessages: (chatId) => {
        return new Promise ((resolve, reject) => {
            var query = `UPDATE messages SET is_expired = 1 WHERE chat_id = ?`

            conn.query(query, [chatId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    approvalConfirm: (sosId, userAgentId) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE sos SET sos_activity_type = ?, 
            user_agent_id = ? 
            WHERE uid = ?`

            conn.query(query, [3, userAgentId, sosId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    findById: (sosId) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT s.user_id, s.user_agent_id, sat.name AS status
            FROM sos s
            INNER JOIN sos_activity_types sat ON sat.id = s.sos_activity_type 
            WHERE s.uid = ?`

            conn.query(query, [sosId], (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkSosIsRunning: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT s.uid, c.uid as chat_id, c.receiver_id
            FROM sos s
            INNER JOIN chats c 
            ON c.sos_id = s.uid
            WHERE s.sos_activity_type IN (3) 
            AND s.user_id = ?`
            conn.query(query, [userId], (e, result) => {
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

    resolvedSos: (sosId) => {
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

    checkSosExpire: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, TIMESTAMPDIFF(HOUR, created_at, NOW()) AS difference FROM sos`
            conn.query(query, (e, result) => {
                if (e) {
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
            AND sos_activity_type = 5`
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
            var query = `UPDATE sos SET sos_activity_type = 5
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