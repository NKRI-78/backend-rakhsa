const conn = require('../configs/db')

module.exports = {

    login: (val) => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    u.uid, u.email, u.phone, u.password, u.enabled, 
                    u.is_logged_in,
                    p.fullname, r.name AS role
                FROM 
                    users u
                INNER JOIN 
                    profiles p ON p.user_id = u.uid
                INNER JOIN 
                    user_roles ur ON ur.user_id = p.user_id
                INNER JOIN 
                    roles r ON r.id = ur.role_id
                WHERE 
                    u.email = ? OR (u.username = ? OR u.phone = ?)
            `;

            conn.query(query, [val, val, val], (error, results) => {
                if (error) {
                    reject(new Error(error.message));
                } else {
                    // Resolve with query results
                    resolve(results);
                }
            });
        });
    },
    

    registerMember: (userId, otp, email, phone, password) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, otp, email, phone, password) VALUES (?, ?, ?, ?, ?)`
            conn.query(query, [userId, otp, email, phone, password], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    registerAmulet: (uid, email, phone, password) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, email, phone, password, enabled) VALUES (?, ?, ?, ?, ?)`
            conn.query(query, [uid, email, phone, password, 1], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
    
    isEmailAlreadyActive: (email) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT email FROM users WHERE email = ? AND enabled = 1`
            conn.query(query, [email], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    checkEmail: (email) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT email FROM users WHERE email = ?`
            conn.query(query, [email], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    checkOtp: (email, otp) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT u.uid, u.otp, u.email, u.phone, r.name AS role, p.fullname, u.created_at
                FROM users u
                INNER JOIN profiles p ON u.uid = p.user_id
                INNER JOIN user_roles ur ON ur.user_id = p.user_id
                INNER JOIN roles r ON r.id = ur.role_id
                WHERE u.email = '${email}' 
                AND u.otp = '${otp}' 
                AND u.enabled = 0`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    verifyOtp: (email) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users
            SET enabled = 1, 
            updated_at = NOW()
            WHERE email = ?`
            conn.query(query, [email], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },
    
    resendOtp: (email, otp) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users
            SET otp = ?, created_at = NOW()
            WHERE email = ?`
            conn.query(query, [otp, email], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    createUser: (userId, email, username, phone, password) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, email, username, phone, password) 
            VALUES (?, ?, ?, ?, ?)`
            conn.query(query, [userId, email, username, phone, password], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }, 

    updateOtp: (otp, email) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users 
            SET otp = ?, created_at = NOW(), updated_at = NOW()
            WHERE email = ?`
            conn.query(query, [otp, email], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    updateIsLoggedIn: (userId, type) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET is_logged_in = ? WHERE uid = ?`
            conn.query(query, [type == "login" ? 1 : 0, userId], (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    }

}