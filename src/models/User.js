const conn = require('../configs/db')
const connDBPos = require('../configs/db_pos')
const connDBRegion = require('../configs/db_region')
const connPPOB = require('../configs/db_ppob')
const { v4: uuidv4 } = require('uuid')

module.exports = {

    self: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT u.uid, u.email, u.phone, u.role, j.name AS job, j.uid AS job_id, o.name AS organization, p.address_ktp, 
            p.no_ktp, p.fullname, o.path AS organization_path, o.bahasa_name, o.english_name, p.avatar, p.pic_ktp, p.reminder_date, u.role, tm.name AS member, unm.no_member, sr.store_id, 
            u.no_referral, p.province, p.city, p.district, p.subdistrict 
            FROM profiles p
            INNER JOIN users u ON u.uid = p.user_id
            LEFT JOIN user_jobs uj ON u.uid = uj.user_id
            LEFT JOIN user_organizations uo ON u.uid = uo.user_id
            LEFT JOIN organizations o ON o.uid = uo.organization_id
            LEFT JOIN jobs j ON j.uid = uj.job_id
            LEFT JOIN type_members tm ON tm.id = p.member_type
            LEFT JOIN user_no_members unm ON unm.user_id = u.uid 
            LEFT JOIN stores sr ON p.user_id = sr.owner
            WHERE u.uid = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getUsers: (username) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.user_id, p.fullname, p.avatar
            FROM users u 
            INNER JOIN profiles p 
            ON u.uid = p.user_id
            WHERE p.fullname LIKE '%${username}%'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkUsername: (username) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.fullname FROM profiles p
            WHERE p.username = LOWER(REPLACE('${username}', ' ', ''))`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkFulfilledData: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT email, role FROM users u 
            LEFT JOIN data_educators ded 
            ON u.uid = ded.user_id
            LEFT JOIN data_enterpreneurs de
            ON u.uid = de.user_id
            LEFT JOIN data_leaders dl 
            ON u.uid = dl.user_id
            LEFT JOIN data_trainnings dt
            ON u.uid = dt.user_id
            WHERE ded.user_id = '${userId}' 
            OR de.user_id = '${userId}'
            OR dl.user_id = '${userId}'
            OR dt.user_id = '${userId}'`

            // console.log(query)
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkUsers: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT email FROM users WHERE uid = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insert: (userId, fullname) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO profiles (user_id, fullname) 
            VALUES ('${userId}', '${fullname}')`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertv2: (userId, name, address, noKtp) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO profiles (user_id, fullname, address_ktp, no_ktp) 
            VALUES ('${userId}', '${name}', '${address}', '${noKtp}')`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    update: (userId, avatar, fullname, address, picKtp, noKtp, province, city, district, subdistrict) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET 
            avatar = '${avatar}',
            fullname = '${fullname}',
            username = LOWER(REPLACE('${fullname}', ' ', '')),
            address_ktp = '${address}', 
            pic_ktp = '${picKtp}',
            no_ktp = '${noKtp}', 
            province = '${province}', 
            city = '${city}', 
            district = '${district}', 
            subdistrict = '${subdistrict}'
            WHERE user_id = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateMemberPayment: (userId, month) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE profiles SET member_type = 2, reminder_date = DATE_ADD(NOW(), INTERVAL ${month} MONTH) WHERE user_id = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getStoreId: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT  
            sr.store_id
            FROM profiles p
            LEFT JOIN stores sr ON p.user_id = sr.owner
            WHERE p.user_id = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0].store_id)
                    } else {
                        reject(new Error("Not Found"))
                    }
                }
            })
        })
    },

    getUserFullnameAndPhone: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT  
            p.fullname, u.phone
            FROM profiles p
            LEFT JOIN users u ON p.user_id = u.uid
            WHERE p.user_id = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0])
                    } else {
                        reject(new Error("Not Found"))
                    }
                }
            })
        })
    },

    updateBalance: (userId, amount) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO user_balances (uid, amount, user_id) VALUES 
                ('${uuidv4()}', '${amount}', '${userId}') 
                ON DUPLICATE KEY UPDATE amount = amount + ${amount}, updated_at = NOW()`

            connPPOB.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    isAdmin: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT role from users where uid = '${userId}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        console.log(result[0].role)
                        if (result[0].role == 'adminhp3ki' || result[0].role == 'superadmin') {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    } else {
                        reject(new Error('Not Found'))
                    }
                }
            })
        })
    },

    setNoReferral: (userId, ref) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE users SET no_referral = '${ref}' WHERE uid = '${userId}'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProvincePos: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT province_id, province_name FROM tb_ro_provinces`

            connDBRegion.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCityPos: (provinceId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT city_name, postal_code 
            FROM tb_ro_cities
            WHERE province_id = '${provinceId}'`

            connDBRegion.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertOrderPos: (orderId, catId, qty) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO orders (order_id, cat_id, qty) VALUES ('${orderId}', '${catId}', '${qty}')`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insertOrderPosDetail: (orderId, totalQty, totalPrice) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO order_details (order_id, total_qty, total_price) 
            VALUES ('${orderId}', '${totalQty}', '${totalPrice}')`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createCatalogPos: (data) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO catalogs (name, img, price, \`desc\`, category_id) 
            VALUES ('${data.name}', '${data.img}', '${data.price}', '${data.desc}', '${data.cat_id}')`;

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteCatalogPos: (data) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM catalogs WHERE id = '${data.id}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateCatalogPos: (data) => {
        return new Promise((resolve, reject) => {
            var query = `UPDATE catalogs SET name = '${data.name}', 
            img = '${data.img}', price = '${data.price}', \`desc\` = '${data.desc}', 
            category_id = '${data.cat_id}' WHERE id = '${data.id}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCatalogPosById: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM catalogs
            WHERE id = '${id}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCategoryPos: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM catalog_categories`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCategoryPosById: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM catalog_categories WHERE id = '${id}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCatalogPosByCategoryId: (categoryId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM catalogs WHERE category_id = '${categoryId}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    addToCartPos: (catId, qty) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO carts (cat_id, qty) 
            VALUES ('${catId}', '${qty}')` 

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteCartPos: (catId) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM carts WHERE cat_id = '${catId}'` 

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    clearCartPos: () => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM carts` 

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getPosCart: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT ct.*, c.qty FROM carts c
            INNER JOIN catalogs ct 
            ON c.cat_id = ct.id` 

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getOrderPos: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT c.*, o.order_id, o.qty FROM orders o
            INNER JOIN catalogs c 
            ON o.cat_id = c.id`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getOrderPosDetail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT od.total_qty, od.total_price 
            FROM order_details od
            INNER JOIN orders o 
            ON od.order_id = o.order_id 
            WHERE o.order_id = '${id}'`

            connDBPos.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getUserNullProvinceCity: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT p.fullname, p.user_id, um.no_member FROM profiles p LEFT JOIN user_no_members um ON p.user_id = um.user_id WHERE (p.province IS NULL OR p.city IS NULL) AND um.no_member IS NOT NULL AND um.no_member LIKE 'HP3KI%'`

            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}

