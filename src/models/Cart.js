const conn = require('../configs/db')

module.exports = {

    cartSelected: (userId) => {
        var query = `SELECT sc.quantity, p.price 
        FROM shopping_carts sc
        INNER JOIN products p ON sc.product_id = p.product_id
        WHERE sc.user_id = '${userId}' 
        AND sc.selected = 1`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    info: (userId) => {
        var query = `SELECT 
        GROUP_CONCAT(sc.cart_id) AS cart_id, 
        GROUP_CONCAT(sc.selected) AS selected,
        GROUP_CONCAT(sc.product_id) AS product_id, 
        GROUP_CONCAT(sc.quantity) AS quantity, 
        GROUP_CONCAT(sc.note) AS note,
        s.store_id,
        s.name AS store_name, 
        s.picture AS store_picture,
        s.description AS store_description,
        s.address AS store_address,
        GROUP_CONCAT(p.product_id) AS product_id,
        GROUP_CONCAT(p.name) AS product_name,
        GROUP_CONCAT(p.price) AS product_price,
        GROUP_CONCAT(p.weight) AS product_weight,
        GROUP_CONCAT(p.stock) AS product_stock,
        GROUP_CONCAT(p.min_order) AS product_min_order
        FROM shopping_carts sc 
        INNER JOIN products p ON sc.product_id  = p.product_id 
        INNER JOIN stores s ON p.store_id = s.store_id
        WHERE sc.user_id = '${userId}'
        GROUP BY s.id`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    find: (productId, userId) => {
        var query = `SELECT cart_id, product_id FROM shopping_carts WHERE product_id = '${productId}' AND user_id = '${userId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    update: (cartId, quantity, note) => {
        var query = `UPDATE shopping_carts SET quantity =  quantity + ${quantity}, note = '${note}' cart_id = '${cartId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateCartAll: (selected, userId) => {
        var query = `UPDATE shopping_carts SET selected = '${selected}' 
        WHERE user_id = '${userId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateCartSelected: (selected, cartId, userId) => {
        var query = `UPDATE shopping_carts SET selected = '${selected}' 
        WHERE cart_id = '${cartId}' AND user_id = '${userId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateQuantityCart: (cartId, userId, quantity) => {
        var query = `UPDATE shopping_carts SET quantity = '${quantity}' 
        WHERE cart_id = '${cartId}' AND user_id = '${userId}'`

        console.log(query)

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateNote: (cartId, userId, note) => {
        var query = `UPDATE shopping_carts SET note = '${note}' WHERE cart_id = '${cartId}' AND user_id = '${userId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateNoteBuyLive: (uid, userId, note) => {
        var query = `UPDATE shopping_lives SET note = '${note}' WHERE uid = '${uid}' AND user_id = '${userId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    create: (cartId, userId, productId, quantity, note) => {
        var query = `INSERT INTO shopping_carts (cart_id, user_id, product_id, quantity, note) 
        VALUES ('${cartId}', '${userId}', '${productId}', '${quantity}', '${note}')`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (cartId, userId) => {
        var query = `DELETE FROM shopping_carts WHERE cart_id = '${cartId}' AND user_id = '${userId}'`

        return new Promise((resolve, reject) => {
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