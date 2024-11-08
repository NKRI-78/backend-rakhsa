const conn = require('../configs/db')

module.exports = {

    remote: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT is_active FROM remotes`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    login: (username) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.avatar, u.uid, u.phone, u.email_activated, u.role, u.email, u.password, p.fullname 
            FROM profiles p 
            INNER JOIN users u ON u.uid = p.user_id
            WHERE u.phone = LOWER('${username}')`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    memberTable: (year) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.fullname, MONTH(mp.created_at) AS month_d 
            FROM profiles p 
            INNER JOIN member_payments mp ON mp.user_id = p.user_id
            WHERE YEAR(mp.created_at) = '${year}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMemberBatch: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.user_id, p.fullname, p.reminder_date, unm.no_member, 
            DATEDIFF(p.reminder_date, NOW()) AS time_remaining,
            DATEDIFF(p.reminder_date - interval 10 day, NOW()) AS reminder_10_days_before
            FROM profiles p 
            INNER JOIN user_no_members unm ON unm.user_id = p.user_id 
            GROUP BY p.id, p.fullname`
            // LIMIT 0, ${offset}  

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateMemberType: (userId, type) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET member_type = '${type}' WHERE user_id = '${userId}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMember: (search) => {
        return new Promise((resolve, reject) => {
            var filter = '';
            if (search != null) {
                filter = `AND (u.no_referral LIKE '%${search}%'|| u.referral LIKE '%${search}%' || p.fullname LIKE '%${search}%')`
            }
            var query = `SELECT p.user_id, 
            p.fullname, u.email, u.phone, 
            o.name organization_name,
            u.created_at,
            j.name job_name,
            p.address_ktp, p.reminder_date, 
            unm.no_member, 
            (SELECT pr.fullname FROM users ur left join profiles pr ON pr.user_id = ur.uid WHERE ur.no_referral = u.referral LIMIT 1) as link_user
            FROM profiles p 
            INNER JOIN user_organizations uo ON uo.user_id = p.user_id
            INNER JOIN organizations o ON o.uid = uo.organization_id
            INNER JOIN user_jobs uj ON uj.user_id = p.user_id
            INNER JOIN jobs j ON j.uid = uj.job_id
            INNER JOIN user_no_members unm ON unm.user_id = p.user_id
            INNER JOIN users u ON p.user_id = u.uid
            WHERE u.phone_activated = '0' ${filter}
            GROUP BY p.id, p.fullname
            ORDER BY u.created_at DESC`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getMemberReport: (search) => {
        return new Promise((resolve, reject) => {
            var filter = '';
            if (search != null) {
                filter = `AND (p.fullname LIKE '%${search}%' || u.email LIKE '%${search}%' || p.no_ktp LIKE '%${search}%')`
            }
            var query = `SELECT p.user_id, 
            p.fullname, u.email, u.phone, 
            p.no_ktp,
            p.address_ktp,
            p.created_at, 
            de.name_instance,
            de.employee_count,
            fb.name as business_name,
            fc.name as classification_name,
            p.province, 
            p.city
            FROM profiles p 
            INNER JOIN user_organizations uo ON uo.user_id = p.user_id
            INNER JOIN organizations o ON o.uid = uo.organization_id
            INNER JOIN user_jobs uj ON uj.user_id = p.user_id
            INNER JOIN jobs j ON j.uid = uj.job_id
            INNER JOIN user_no_members unm ON unm.user_id = p.user_id
            INNER JOIN users u ON p.user_id = u.uid
            LEFT JOIN data_enterpreneurs de ON p.user_id = de.user_id
            LEFT JOIN form_of_businesses fb ON de.form_of_business = fb.uid
            LEFT JOIN form_of_classifications fc ON de.form_of_classification = fc.uid
            WHERE u.phone_activated = '0' ${filter}

            GROUP BY p.id, p.fullname ORDER BY p.created_at DESC`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    totalUserRegisteredByMonth: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
                DATE_FORMAT(u.created_at, '%Y-%m') AS month,
                COUNT(*) AS count
            FROM 
                users u
            INNER JOIN 
                profiles p ON p.user_id = u.uid
            GROUP BY 
                DATE_FORMAT(u.created_at, '%Y-%m')
            ORDER BY 
                month`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    totalUserPlatinumByMonth: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
                mp.created_at, 
                COUNT(*) AS count
            FROM 
                users u 
            INNER JOIN 
                profiles p 
                ON p.user_id = u.uid 
            INNER JOIN 
                member_payments mp 
                ON mp.user_id = p.user_id
            GROUP BY (YEAR(u.created_at) * 100) + MONTH(u.created_at)
               
            `
            // (YEAR(mp.created_at) * 100) + MONTH(mp.created_at)
            // (YEAR(u.created_at) * 100) + MONTH(u.created_at)
            
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    totalUserMemberByMonth: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.created_at, COUNT(*) AS count
            FROM users u 
            INNER JOIN profiles p ON p.user_id = u.uid 
            INNER JOIN type_members tm ON tm.id = p.member_type
            WHERE tm.name = 'MEMBER' 
            GROUP BY (YEAR(u.created_at) * 100) + MONTH(u.created_at)`

            // query = `SELECT 
            //     YEAR(u.created_at) AS year, 
            //     COUNT(*) AS count
            //     FROM users u
            //     INNER JOIN profiles p ON p.user_id = u.uid
            //     INNER JOIN type_members tm ON tm.id = p.member_type
            //     WHERE tm.name = 'MEMBER'
            //     GROUP BY YEAR(u.created_at)
            //     ORDER BY YEAR(u.created_at)
            // `

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    dataTypeUser: (type) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.avatar, u.email, u.phone, p.fullname,
            p.address_ktp
            FROM users u 
            INNER JOIN profiles p ON p.user_id = u.uid 
            INNER JOIN type_members tm ON tm.id = p.member_type
            WHERE tm.name = '${type}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    dataTypeUserPlatinum: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.avatar, u.email, u.phone, p.fullname,
            p.address_ktp
            FROM users u 
            INNER JOIN profiles p ON p.user_id = u.uid 
            INNER JOIN member_payments mp ON mp.user_id = p.user_id`
           
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    revenueTotal: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.email, u.phone, p.fullname, mp.amount 
            FROM member_payments mp 
            INNER JOIN profiles p ON p.user_id = mp.user_id 
            INNER JOIN users u ON u.uid = p.user_id`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    revenue: (month) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.email, u.phone, p.fullname, mp.amount, mp.created_at 
            FROM member_payments mp 
            INNER JOIN profiles p ON p.user_id = mp.user_id 
            INNER JOIN users u ON u.uid = p.user_id 
            WHERE MONTH(mp.created_at) LIKE '%${month}%'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkins: () => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT c.uid, p.fullname, c.checkin_date, c.start, c.end, c.location 
            FROM checkins c
            LEFT JOIN profiles p ON p.user_id = c.user_id
            ORDER BY c.checkin_date DESC
            
            `

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkinDetail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT c.uid, p.fullname, c.checkin_date, c.start, c.end, c.location 
            FROM checkins c
            LEFT JOIN profiles p ON p.user_id = c.user_id
            WHERE c.uid = '${id}'
            ORDER BY c.checkin_date DESC
            
            `

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkinJoin: (uids) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT  p.fullname, j.checkin_id as uid, u.phone, u.email FROM checkin_joins j
            LEFT JOIN profiles p ON p.user_id = j.user_id
            LEFT JOIN users u ON u.uid = p.user_id
            WHERE checkin_id IN (${conn.escape(uids)})
            `

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}