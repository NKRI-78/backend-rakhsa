const conn = require('../configs/db')

module.exports = {

    login: (val) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.avatar, u.uid, u.phone, u.email_activated, u.role, u.email, u.password, p.fullname
            FROM users u
            INNER JOIN profiles p ON u.uid = p.user_id
            WHERE u.email = '${val}' OR u.phone = '${val}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    register: (uid, otp, phone, email, password, referral) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, otp, phone, email, role, password, referral) 
            VALUES ('${uid}', '${otp}', '${phone}', '${email}', 'user', '${password}', '${referral}') 
            ON DUPLICATE KEY UPDATE created_at = NOW()`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    registerv2: (uid, phone, email) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO users (uid, phone, email, role, password) 
            VALUES ('${uid}', '${phone}', '${email}', 'user', '${password}') 
            ON DUPLICATE KEY UPDATE created_at = NOW()`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    activeToggle: (user_id, status) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE users SET status = '${status}' WHERE uid = '${user_id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkIsActive: (user_id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT status FROM users WHERE uid = '${user_id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (user_id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM users WHERE uid = '${user_id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteProfile: (user_id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM profiles WHERE user_id = '${user_id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    changePassword: (email, password) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE users SET password = '${password}' WHERE email = '${email}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertOtp: (email, otp) => {
        return new Promise((resolve, reject) => {
            const query = `INSERT users (email, otp) VALUES ('${email}', '${otp}') 
            ON DUPLICATE KEY UPDATE email = '${email}', otp = '${otp}', created_at = NOW()`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    updateOtp: (otp, email) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users 
            SET otp = '${otp}', created_at = NOW(), updated_at = NOW()
            WHERE email = '${email}'`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    isEmailAlreadyActive: (email) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT email FROM users WHERE email = '${email}' AND email_activated = 1`
            conn.query(query, (e, res) => {
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
            const query = `SELECT email, password FROM users WHERE email = '${email}'`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    checkPhone: (phone) => {
        return new Promise((resolve, reject) => {
            const query = `SELECT phone FROM users WHERE phone = '${phone}'`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

    updateEmailOtp: (oldEmail, newEmail) => {
        return new Promise((resolve, reject) => {
            const query = `UPDATE users SET email = '${newEmail}' 
            WHERE email = '${oldEmail}'`
            conn.query(query, (e, res) => {
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
            const query = `SELECT u.uid, u.otp, u.email, u.phone, p.fullname, u.created_at
                FROM users u
                INNER JOIN profiles p
                ON u.uid = p.user_id
                WHERE u.email = '${email}' 
                AND u.otp = '${otp}' 
                AND u.email_activated = 0`
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
            SET email_activated = 1, 
            status = 'enabled', 
            updated_at = NOW()
            WHERE email = '${email}'`
            conn.query(query, (e, res) => {
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
            SET otp = '${otp}', created_at = NOW()
            WHERE email = '${email}'`
            conn.query(query, (e, res) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(res)
                }
            })
        })
    },

}