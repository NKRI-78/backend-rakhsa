const conn = require('../configs/db')

module.exports = {

    getDataSeller: (userId, orderStatus) => {
        var query = `SELECT tor.payment_channel, tor.order_status, tor.payment_status, tor.created_at,
            tor.transaction_id,
            i.value AS invoice, 
            tor.waybill, 
            tor.invoice_url,
            ubp.name AS buyer_name,
            ub.email_address AS buyer_email,
            ub.phone_number AS buyer_phone,
            sa.address AS buyer_address,
            sa.province AS buyer_province,
            sa.city AS buyer_city,
            sa.postal_code AS buyer_postalcode,
            sa.subdistrict AS buyer_subdistrict,
            bu.name AS seller_name,
            bu.profile_pic AS seller_profile_pic,
            u.email_address AS seller_email,
            u.phone_number AS seller_phone,
            s.address AS seller_address,
            s.province AS seller_province,
            s.city AS seller_city,
            s.postal_code AS seller_postalcode,
            s.subdistrict AS seller_subdistrict,
            sa.name AS buyer_label_address,
            s.name AS seller_label_address
            FROM transaction_orders tor 
            INNER JOIN transaction_order_items toi ON tor.transaction_id = toi.transaction_id 
            INNER JOIN products p ON p.product_id = toi.product_id
            INNER JOIN ecommerce_invoices i ON i.transaction_id = tor.transaction_id
            INNER JOIN stores s ON toi.store_id = s.store_id  
            INNER JOIN users u ON s.owner = u.uid 
            INNER JOIN users ub ON tor.user_id = ub.uid
            INNER JOIN profiles bu ON u.uid = bu.user_id
            INNER JOIN profiles ubp ON ub.uid = ubp.user_id 
            INNER JOIN shipping_address sa ON tor.user_id = sa.user_id 
            WHERE u.uid = '${userId}' AND tor.order_status = '${orderStatus}'
            AND sa.default_location = '1'
            GROUP BY tor.id`

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

    getDataBuyer: (userId, orderStatus) => {
        var query = `SELECT tor.payment_channel, tor.order_status, tor.payment_status, tor.created_at,
        tor.transaction_id,
        i.value AS invoice, 
        tor.waybill, 
        tor.invoice_url,
        ubp.name AS buyer_name,
        ub.email_address AS buyer_email,
        ub.phone_number AS buyer_phone,
        sa.address AS buyer_address,
        sa.province AS buyer_province,
        sa.city AS buyer_city,
        sa.postal_code AS buyer_postalcode,
        sa.subdistrict AS buyer_subdistrict,
        bu.name AS seller_name,
        bu.profile_pic AS seller_profile_pic,
        u.email_address AS seller_email,
        u.phone_number AS seller_phone,
        s.address AS seller_address,
        s.province AS seller_province,
        s.city AS seller_city,
        s.postal_code AS seller_postalcode,
        s.subdistrict AS seller_subdistrict,
        sa.name AS buyer_label_address,
        s.name AS seller_label_address
        FROM transaction_orders tor 
        INNER JOIN transaction_order_items toi ON tor.transaction_id = toi.transaction_id 
        INNER JOIN products p ON p.product_id = toi.product_id
        INNER JOIN ecommerce_invoices i ON i.transaction_id = tor.transaction_id
        INNER JOIN stores s ON toi.store_id = s.store_id  
        INNER JOIN users u ON s.owner = u.uid 
        INNER JOIN users ub ON tor.user_id = ub.uid
        INNER JOIN profiles bu ON u.uid = bu.user_id
        INNER JOIN profiles ubp ON ub.uid = ubp.user_id 
        INNER JOIN shipping_address sa ON tor.user_id = sa.user_id 
        WHERE u.uid = '${userId}' AND tor.order_status = '${orderStatus}'
        AND sa.default_location = '1'
        GROUP BY tor.id`

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

    getDataOrderStatusSeller: (userId) => {
        var query = `SELECT tor.payment_channel, tor.order_status, tor.payment_status, tor.created_at,
        tor.transaction_id,
        i.value AS invoice, 
        tor.invoice_url,
        tor.waybill,
        ubp.name AS buyer_name,
        ub.email_address AS buyer_email,
        ub.phone_number AS buyer_phone,
        sa.address AS buyer_address,
        sa.province AS buyer_province,
        sa.city AS buyer_city,
        sa.postal_code AS buyer_postalcode,
        sa.subdistrict AS buyer_subdistrict,
        bu.name AS seller_name,
        bu.profile_pic AS seller_profile_pic,
        u.email_address AS seller_email,
        u.phone_number AS seller_phone,
        s.address AS seller_address,
        s.province AS seller_province,
        s.city AS seller_city,
        s.postal_code AS seller_postalcode,
        s.subdistrict AS seller_subdistrict,
        sa.name AS buyer_label_address,
        s.name AS seller_label_address
        FROM transaction_orders tor 
        INNER JOIN transaction_order_items toi ON tor.transaction_id = toi.transaction_id 
        INNER JOIN products p ON p.product_id = toi.product_id
        INNER JOIN ecommerce_invoices i ON i.transaction_id = tor.transaction_id
        INNER JOIN stores s ON toi.store_id = s.store_id  
        INNER JOIN users u ON s.owner = u.uid 
        INNER JOIN users ub ON tor.user_id = ub.uid
        INNER JOIN profiles bu ON u.uid = bu.user_id
        INNER JOIN profiles ubp ON ub.uid = ubp.user_id 
        INNER JOIN shipping_address sa ON tor.user_id = sa.user_id 
        WHERE u.uid = '${userId}'
        AND sa.default_location = '1'
        GROUP BY tor.id`

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

    getDataOrderStatusBuyer: () => {
        var query = `SELECT tor.payment_channel, tor.order_status, tor.payment_status, tor.created_at,
        tor.transaction_id,
        i.value AS invoice, 
        tor.invoice_url,
        tor.waybill, 
        ubp.name AS buyer_name,
        ub.email_address AS buyer_email,
        ub.phone_number AS buyer_phone,
        sa.address AS buyer_address,
        sa.province AS buyer_province,
        sa.city AS buyer_city,
        sa.postal_code AS buyer_postalcode,
        sa.subdistrict AS buyer_subdistrict,
        bu.name AS seller_name,
        bu.profile_pic AS seller_profile_pic,
        u.email_address AS seller_email,
        u.phone_number AS seller_phone,
        s.address AS seller_address,
        s.province AS seller_province,
        s.city AS seller_city,
        s.postal_code AS seller_postalcode,
        s.subdistrict AS seller_subdistrict,
        sa.name AS buyer_label_address,
        s.name AS seller_label_address
        FROM transaction_orders tor 
        INNER JOIN transaction_order_items toi ON tor.transaction_id = toi.transaction_id 
        INNER JOIN products p ON p.product_id = toi.product_id
        INNER JOIN ecommerce_invoices i ON i.transaction_id = tor.transaction_id
        INNER JOIN stores s ON toi.store_id = s.store_id  
        INNER JOIN users u ON s.owner = u.uid 
        INNER JOIN users ub ON tor.user_id = ub.uid
        INNER JOIN profiles bu ON u.uid = bu.user_id
        INNER JOIN profiles ubp ON ub.uid = ubp.user_id 
        INNER JOIN shipping_address sa ON tor.user_id = sa.user_id 
        WHERE ub.uid = '${userId}'
        AND sa.default_location = '1'
        GROUP BY tor.id`

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

    getProductByTransactionId: (transactionId) => {
        var query = `SELECT 
        p.product_id AS productId,
        p.name AS productName, 
        p.price AS productPrice,
        toi.weight AS productWeight,
        toi.note AS productNote,
        toi.quantity AS productQty
        FROM products p
        INNER JOIN transaction_order_items toi ON toi.product_id = p.product_id
        WHERE toi.transaction_id = '${transactionId}'`

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

    getStoreByOwner: (owner) => {
        var query = `SELECT * FROM stores WHERE owner = '${owner}'`

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

    getStoreByStoreId: (store_id) => {
        var query = `SELECT * FROM stores WHERE store_id = '${store_id}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0])
                    } else {
                        reject(new Error('Not Found'))
                    }
                }
            })
        })
    },

    getAllStore: () => {
        var query = `SELECT store_id, owner, name, description, 
        picture, province, city, subdistrict, postal_code, address, email, phone, 
        lat, lng, open, status, approved, created_at, updated_at FROM stores`

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

    getStoreInfo: (storeId) => {
        var query = `SELECT store_id, owner, name, description, 
        picture, province, city, district, subdistrict, postal_code, address, email, phone, 
        lat, lng, open, status, created_at, updated_at 
        FROM stores WHERE store_id = '${storeId}'`

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

    getSupportedCouriers: () => {
        var query = `SELECT courier_id FROM store_couriers`

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

    createStore: (data) => {
        var query = `INSERT stores (store_id, owner, name, description, 
        picture, province, city, district, subdistrict, postal_code, 
        origin_code, address, email, phone, lat, lng, open, status
        ) VALUES ('${data.id}', '${data.owner}',
        '${data.name}', '${data.description}', '${data.picture}', 
        '${data.province}', '${data.city}', '${data.district}', 
        '${data.subdistrict}', '${data.postal_code}', 
        '${data.origin_code}', '${data.address}', '${data.email}', 
        '${data.phone}', '${data.lat}', '${data.lng}', '${data.open}',
        '${data.status}') ON DUPLICATE KEY UPDATE name = '${data.name}', 
        description = '${data.description}', picture = '${data.picture}', 
        province = '${data.province}', city = '${data.city}', 
        district = '${data.district}', subdistrict = '${data.subdistrict}',
        postal_code = '${data.postal_code}', origin_code = '${data.origin_code}',
        address = '${data.address}', open = '${data.open}'`

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