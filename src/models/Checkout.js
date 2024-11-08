const conn = require('../configs/db')
const ro_conn = require('../configs/db_raja_ongkir')

module.exports = {
    addProductShoppingLive: (data) => {
        var query = `INSERT INTO shopping_lives 
        (uid, user_id, product_id, quantity, note) 
        VALUES('${data.uid}', '${data.userId}', '${data.product_id}', '${data.quantity}', '${data.note}')
        ON DUPLICATE KEY UPDATE product_id = '${data.product_id}', note = '${data.note}'`

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
    selectDistrict: (store_id) => {
        var query = `SELECT district FROM stores WHERE store_id = '${store_id}'`

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

    getQtyPriceShoppingLive: (userId) => {
        var query = `SELECT sl.quantity, p.price 
        FROM shopping_lives sl
        INNER JOIN products p ON sl.product_id = p.product_id
        WHERE sl.user_id = '${userId}' 
    `

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

    getProductsGroupConcat: (userId) => {
        var query = `SELECT 
        GROUP_CONCAT(sc.uid) AS cart_id, 
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
        FROM shopping_lives sc 
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

    addCourierProduct: (data) => {
        var query = `INSERT INTO checkout_couriers 
        (uid, user_id, store_id, courier_code, courier_service, courier_name, courier_description, cost_value, cost_note, cost_etd)
        VALUES ('${data.uid}', '${data.userId}', '${data.store_id}', '${data.courier_code}', '${data.courier_service}', 
        '${data.courier_name}', '${data.courier_description}', '${data.cost_value}', '${data.cost_note}', '${data.cost_etd}') 
        ON DUPLICATE KEY UPDATE 
        courier_service = '${data.courier_service}', 
        courier_name = '${data.courier_name}', 
        courier_description = '${data.courier_description}',
        cost_value = '${data.cost_value}',
        cost_note = '${data.cost_note}',
        cost_etd = '${data.cost_etd}'
    `

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
    productCart: (userId) => {
        var query = `SELECT sc.product_id, sc.quantity, pc.type, p.category_id, p.weight 
        FROM shopping_carts sc
        INNER JOIN products p ON sc.product_id = p.product_id
        INNER JOIN product_categories pc ON p.category_id = pc.category_id
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
    productLive: (userId) => {
        var query = `SELECT sl.product_id, sl.quantity, pc.type, p.category_id, p.weight 
        FROM shopping_lives sl
        INNER JOIN products p ON sl.product_id = p.product_id
        INNER JOIN product_categories pc ON p.category_id = pc.category_id
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


    getShippingAddressByUser: (userId) => {
        var query = `SELECT * FROM shipping_address WHERE user_id = '${userId}' and default_location = 1`


        return new Promise((resolve, reject) => {
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
    getSubdistrictId: (subdistricts) => {
        var query = `SELECT * FROM tb_ro_subdistricts WHERE subdistrict_name = '${subdistricts}'`

        return new Promise((resolve, reject) => {
            ro_conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0].subdistrict_id)
                    } else {
                        reject(new Error("Not Found"))
                    }

                }
            })
        })
    },

    getCheckoutProductLive: (data) => {

        var query = `SELECT sl.product_id, sl.quantity, p.category_id, p.weight, p.store_id, p.price, sl.note
        FROM shopping_lives sl
        INNER JOIN products p ON sl.product_id = p.product_id
        WHERE sl.user_id = '${data.userId}' AND p.store_id IN (${conn.escape(data.shipments)})
        `


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

    getCheckoutProductCart: (data) => {

        var query = `SELECT sl.product_id, sl.quantity, p.category_id, p.weight, p.store_id, p.price, sl.note
        FROM shopping_carts sl
        INNER JOIN products p ON sl.product_id = p.product_id
        WHERE sl.user_id = '${data.userId}' AND p.store_id IN (${conn.escape(data.shipments)}) AND sl.selected = 1
        `


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

    createPayment: (payment) => {

        var query = `
        insert into payments SET ?
        `;

        return new Promise((resolve, reject) => {
            conn.query(query, [payment], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
    deleteCartUser: (userId) => {
        var query = `
        DELETE FROM shopping_carts WHERE user_id = '${userId}'
        `;
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

    createOrders: (orders) => {

        var query = `
        insert into orders (order_id, payment_id, store_id, amount, shipping_amount, shipping_code, shipping_name, shipping_address, shipping_address_detail, receiver_phone) VALUES ?
        `;

        return new Promise((resolve, reject) => {
            conn.query(query, [orders], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrderItems: (items) => {

        var query = `
        insert into order_items (order_id, product_id, qty, price, weight, note) VALUES ?
        `;

        return new Promise((resolve, reject) => {
            conn.query(query, [items], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }
}