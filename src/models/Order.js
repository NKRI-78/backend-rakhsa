
const conn = require('../configs/db')
const moment = require('moment');
const axios = require('axios');

module.exports = {

    createAirWayBill: (orderId, store, shipping, order, user) => {
        return new Promise((resolve, reject) => {

            String.prototype.chunk = function (size) {
                return [].concat.apply([],
                    this.split('').map(function (x, i) { return i % size ? [] : this.slice(i, i + size) }, this)
                )
            }

            var addressShippingChunk = shipping.address.chunk(30)

            const data = {
                username: process.env.API_JNE_USERNAME,
                api_key: process.env.API_JNE_KEY,
                OLSHOP_BRANCH: 'CGK000',
                OLSHOP_CUST: '80580700',
                OLSHOP_ORDERID: orderId,
                OLSHOP_SHIPPER_NAME: store.name,
                OLSHOP_SHIPPER_ADDR1: store.address,
                OLSHOP_SHIPPER_ADDR2: store.district,
                OLSHOP_SHIPPER_ADDR3: store.subdistrict,
                OLSHOP_SHIPPER_CITY: store.city,
                OLSHOP_SHIPPER_REGION: store.province,
                OLSHOP_SHIPPER_ZIP: store.postal_code,
                OLSHOP_SHIPPER_PHONE: store.phone,
                OLSHOP_RECEIVER_NAME: user.fullname,
                OLSHOP_RECEIVER_ADDR1: addressShippingChunk[0],
                OLSHOP_RECEIVER_ADDR2: addressShippingChunk.length >= 2 ? addressShippingChunk[1] : "",
                OLSHOP_RECEIVER_ADDR3: addressShippingChunk.length >= 3 ? addressShippingChunk[2] : "",
                OLSHOP_RECEIVER_CITY: shipping.city,
                OLSHOP_RECEIVER_REGION: shipping.province,
                OLSHOP_RECEIVER_ZIP: shipping.zip_code,
                // OLSHOP_RECEIVER_PHONE: user.phone,
                OLSHOP_RECEIVER_PHONE: order.receiver_phone,
                OLSHOP_QTY: order.quantity,
                OLSHOP_WEIGHT: order.weight / 1000,
                OLSHOP_GOODSDESC: order.weight,
                OLSHOP_GOODSVALUE: order.total_price,
                OLSHOP_GOODSTYPE: 1,
                OLSHOP_INST: "GOOD",
                OLSHOP_INS_FLAG: "N",
                OLSHOP_ORIG: store.origin_code,
                OLSHOP_DEST: shipping.dest,
                OLSHOP_SERVICE: order.shipping_code,
                OLSHOP_COD_FLAG: "N",
                OLSHOP_COD_AMOUNT: 0
            };
            // console.log(data)

            var config = {
                method: 'POST',
                url: process.env.API_GENERATE_AIRWAYBILL_JNE_URL,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data
            };

            axios(config).then(function (response) {
                // handle success
                //console.log(response.data);
                resolve(response.data.detail[0].cnote_no)
            })
                .catch(function (error) {
                    // handle error
                    console.log(error)
                    reject(new Error(error))
                })
        })
    },

    getOrdersPending: (storeId) => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT DISTINCT o.*, (SELECT COUNT(*) FROM order_items oi WHERE oi.order_id = o.order_id) AS product_count FROM orders o 
                LEFT JOIN payments p ON p.payment_id = o.payment_id
                WHERE p.status = "PAID" AND o.status IS NULL AND o.store_id = '${storeId}'
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

    getStoreOrdersByStatus: (storeId, status) => {
        return new Promise((resolve, reject) => {
            var filter_status;
            var statusPay = 'p.status = "PAID" ';
            if (status == "PENDING") {
                filter_status = 'AND o.status IS NULL'
            } else if (status == "WAITING_FOR_PAYMENT") {
                filter_status = '';
                statusPay = 'p.status = "WAITING_FOR_PAYMENT" ';
            } else if (status == "PAID") {
                filter_status = '';
                statusPay = 'p.status = "PAID"'
            } else if (status == 'SHIPPING') {
                filter_status = ' AND (o.status = "ON PROCESS" || o.status = "DELIVERY")';
            } else if (status == null || status == '') {
                filter_status = '';
                statusPay = 'p.status IS NOT NULL';
            }
            else {
                filter_status = `AND o.status = '${status}'`
            }

            var query = `
                SELECT 
                    o.*, 
                    if (p.status = "WAITING_FOR_PAYMENT", "WAITING_FOR_PAYMENT", if (o.status = "ON PROCESS", "SHIPPING", if (o.status = "DELIVERY", "SHIPPING",coalesce(o.status, 'PENDING'))) )  as status,
                    (SELECT SUM(oi.qty) FROM order_items oi WHERE oi.order_id = o.order_id) AS product_count,
                    (SELECT 
                        pp.path
                        FROM order_items oi 
                        LEFT JOIN product_pictures pp ON pp.product_id = oi.product_id
                        WHERE oi.order_id = o.order_id 
                        LIMIT 1) AS product_picture,
                        (SELECT 
                            ps.name
                            FROM order_items oi 
                            LEFT JOIN products ps ON ps.product_id = oi.product_id
                            WHERE oi.order_id = o.order_id 
                            LIMIT 1) AS product_name,
                    p.payment_name, 
                    p.payment_fee, 
                    buyer.fullname as buyer_name, 
                    s.name as store_name
                FROM orders o 
                LEFT JOIN payments p ON p.payment_id = o.payment_id
                LEFT JOIN profiles buyer ON buyer.user_id = p.user_id
                LEFT JOIN stores s ON s.store_id = o.store_id
                WHERE ${statusPay} ${filter_status} AND o.store_id = '${storeId}'
                ORDER BY o.updated_at DESC
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
    getAllOrdersByStatus: (limit, offset, search, status, isAdmin, userId) => {
        return new Promise((resolve, reject) => {
            var filter_status;
            var filter_admin;
            var statusPay = 'p.status = "PAID" ';
            if (status == "PENDING") {
                filter_status = 'AND o.status IS NULL'
            } else if (status == "WAITING_FOR_PAYMENT") {
                filter_status = '';
                statusPay = 'p.status = "WAITING_FOR_PAYMENT" ';
            } else if (status == "PAID") {
                filter_status = '';
                statusPay = 'p.status = "PAID"'
            } else if (status == 'SHIPPING') {
                filter_status = ' AND (o.status = "ON PROCESS" || o.status = "DELIVERY")';
            } else if (status == null || status == '') {
                filter_status = '';
                statusPay = 'p.status IS NOT NULL';
            }
            else {
                filter_status = `AND o.status = '${status}'`
            }
            if (isAdmin) {
                filter_admin = '';
            } else {
                filter_admin = `AND p.user_id = '${userId}'`;
            }
            var query = `
                SELECT 
                    o.*, 
                    if (p.status = "WAITING_FOR_PAYMENT", "WAITING_FOR_PAYMENT", if (o.status = "ON PROCESS" OR o.status = "DELIVERY", "SHIPPING", coalesce(o.status, 'PENDING')) )  as status,
                    (SELECT SUM(oi.qty) FROM order_items oi WHERE oi.order_id = o.order_id) AS product_count,
                    (SELECT 
                        pp.path
                        FROM order_items oi 
                        LEFT JOIN product_pictures pp ON pp.product_id = oi.product_id
                        WHERE oi.order_id = o.order_id 
                        LIMIT 1) AS product_picture,
                        (SELECT 
                            ps.name
                            FROM order_items oi 
                            LEFT JOIN products ps ON ps.product_id = oi.product_id
                            WHERE oi.order_id = o.order_id 
                            LIMIT 1) AS product_name,
                    p.payment_name, 
                    p.payment_fee, 
                    buyer.fullname as buyer_name, 
                    s.name as store_name
                FROM orders o 
                LEFT JOIN payments p ON p.payment_id = o.payment_id
                LEFT JOIN profiles buyer ON buyer.user_id = p.user_id
                LEFT JOIN stores s ON s.store_id = o.store_id
                WHERE ${statusPay} ${filter_status} ${filter_admin}
                ORDER BY o.updated_at DESC
                LIMIT ${offset}, ${limit}
            `

            console.log(`
            SELECT 
                o.*, 
                if (p.status = "WAITING_FOR_PAYMENT", "WAITING_FOR_PAYMENT", if (o.status = "ON PROCESS" OR o.status = "DELIVERY", "SHIPPING", coalesce(o.status, 'PENDING')) )  as status,
                (SELECT SUM(oi.qty) FROM order_items oi WHERE oi.order_id = o.order_id) AS product_count,
                (SELECT 
                    pp.path
                    FROM order_items oi 
                    LEFT JOIN product_pictures pp ON pp.product_id = oi.product_id
                    WHERE oi.order_id = o.order_id 
                    LIMIT 1) AS product_picture,
                    (SELECT 
                        ps.name
                        FROM order_items oi 
                        LEFT JOIN products ps ON ps.product_id = oi.product_id
                        WHERE oi.order_id = o.order_id 
                        LIMIT 1) AS product_name,
                p.payment_name, 
                p.payment_fee, 
                buyer.fullname as buyer_name, 
                s.name as store_name
            FROM orders o 
            LEFT JOIN payments p ON p.payment_id = o.payment_id
            LEFT JOIN profiles buyer ON buyer.user_id = p.user_id
            LEFT JOIN stores s ON s.store_id = o.store_id
            WHERE ${statusPay} ${filter_status} ${filter_admin}
            ORDER BY o.updated_at DESC
            LIMIT ${offset}, ${limit}
        `)


            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getOrderAmountAndBuyer: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT o.amount, o.shipping_amount, p.user_id as buyerId FROM orders o  LEFT JOIN payments p ON p.payment_id = o.payment_id WHERE o.order_id = '${orderId}'
            `
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve({
                            amount: result[0].amount + result[0].shipping_amount,
                            buyerId: result[0].buyerId
                        })
                    } else {
                        reject(new Error("Not Found"))
                    }
                }
            })
        })
    },

    getOrderDetail: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT o.*, p.user_id as buyerId,  
            (SELECT SUM(oi.qty) FROM order_items oi WHERE oi.order_id = o.order_id) AS total_quantity,
            (SELECT SUM(oi.weight) FROM order_items oi WHERE oi.order_id = o.order_id) AS total_weight
            FROM orders o  LEFT JOIN payments p ON p.payment_id = o.payment_id WHERE o.order_id = '${orderId}'
            `
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

    confirmOrder: (orderId, shipping_tracking) => {
        return new Promise((resolve, reject) => {
            var query = `
            UPDATE orders SET status = 'CONFIRM', updated_at = '${moment().format()}', shipping_tracking = '${shipping_tracking}' WHERE order_id = '${orderId}'
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

    updateOrderStock: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            UPDATE products p 
            INNER JOIN order_items o ON o.product_id = p.product_id
            SET p.stock = p.stock - o.qty, p.updated_at = '${moment().format()}'
            WHERE o.order_id = '${orderId}'
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

    confirmUpdateStatusOrder: (orderId, status) => {
        return new Promise((resolve, reject) => {
            var query = `
            UPDATE orders SET status = '${status}', updated_at = '${moment().format()}' WHERE order_id = '${orderId}'
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

    finishOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            UPDATE orders SET updated_at = '${moment().format()}', finish_date = '${moment().format()}', status = 'FINISHED' WHERE order_id = '${orderId}'
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

    cancelOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            UPDATE orders SET status = 'CANCEL', updated_at = '${moment().format()}' WHERE order_id = '${orderId}'
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
    createHistory: (data) => {
        return new Promise((resolve, reject) => {
            var query = `
            insert into order_histories SET ?
            `
            conn.query(query, [data], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getOrdersForTracking: () => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT o.*, p.user_id as buyerId FROM orders o
                LEFT JOIN payments p ON p.payment_id = o.payment_id
                WHERE o.status != 'DELIVERED' AND o.status IS NOT NULL AND o.status != 'CANCEL' AND o.status != 'FINISHED'
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

    getOrderDeliveredButNotFinish: () => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT o.*, s.owner as sellerId FROM orders o
                LEFT JOIN stores s ON s.store_id = o.store_id
                WHERE o.status = 'DELIVERED' AND o.finish_date IS NULL
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

    getOrderSellerAndAmount: (order_id) => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT o.*, s.owner as sellerId FROM orders o
                LEFT JOIN stores s ON s.store_id = o.store_id
                WHERE o.order_id = "${order_id}"
            `
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0]);
                    } else {
                        reject(new Error("Not Found"))
                    }
                }
            })
        })
    },

    getOrderPaidButNotProccess: () => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT o.*, p.user_id as buyer_id FROM orders o
                LEFT JOIN payments p ON o.payment_id = p.payment_id
                WHERE o.status IS NULL AND p.status = "PAID"
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

    getJneTraceTracking: (cnote) => {
        return new Promise((resolve, reject) => {

            const url = `${process.env.API_TRACE_TRACKING_JNE_URL}/${cnote}`;

            var data = {
                username: process.env.API_JNE_USERNAME,
                api_key: process.env.API_JNE_KEY
            }

            var config = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: data
            };

            axios(config).then(function (response) {
                // handle success
                //console.log(response.data);
                resolve(response.data)
            })
                .catch(function (error) {
                    // handle error
                    reject(new Error(error))
                })
        })
    },

    getOrderFullDetail: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT o.*, 
            if (p.status = "WAITING_FOR_PAYMENT", "WAITING_FOR_PAYMENT", coalesce(o.status, 'PENDING'))  as status,
            p.user_id as buyerId,  
            p.payment_method, 
            p.payment_name, 
            p.payment_fee,
            p.payment_url,
            p.status as payment_status, 
            p_buyer.fullname as buyer_name, 
            p_buyer.avatar as buyer_avatar,
            o.receiver_phone,
            p_seller.fullname as seller_name, 
            p_seller.avatar as seller_avatar, 
            s.name as store_name, 
            s.phone as store_phone, 
            s.picture as store_picture, 
            s.lng as store_lng, 
            s.lat as store_lat
            FROM 
                orders o  
            LEFT JOIN 
                payments p ON p.payment_id = o.payment_id 
            LEFT JOIN 
                profiles p_buyer ON p.user_id = p_buyer.user_id
            LEFT JOIN 
                stores s ON s.store_id = o.store_id
            LEFT JOIN 
                profiles p_seller ON p_seller.user_id = s.owner
            WHERE 
                o.order_id = '${orderId}'
            `
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
    getOrderPendingCount: (storeId) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT count(o.id) as count from orders o 
            LEFT JOIN payments p ON o.payment_id = p.payment_id 
            WHERE o.store_id = '${storeId}' AND o.status IS NULL AND p.status = 'PAID'
            `;
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result != 0) {
                        resolve(result[0].count)
                    } else {
                        reject(new Error("NOT FOUND"))
                    }
                }
            })
        });
    },

    getWaitingPayment: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `
            SELECT 
                p.*, 
                (SELECT SUM(oi.qty) FROM order_items oi 
                LEFT JOIN orders o
                    ON oi.order_id = o.order_id
                WHERE o.payment_id = p.payment_id) AS product_count,
                    (SELECT 
                        pp.path
                        FROM order_items oi 
                        LEFT JOIN product_pictures pp ON pp.product_id = oi.product_id
                        LEFT JOIN orders o ON oi.order_id = o.order_id 
                        WHERE o.payment_id = p.payment_id
                        LIMIT 1) AS product_picture,
                        (SELECT 
                            ps.name
                            FROM order_items oi 
                            LEFT JOIN products ps ON ps.product_id = oi.product_id
                            LEFT JOIN orders o ON oi.order_id = o.order_id 
                            WHERE o.payment_id = p.payment_id
                            LIMIT 1) AS product_name
            from 
                payments p
            where 
                p.user_id = '${userId}' and p.status = 'WAITING_FOR_PAYMENT'
            `;


            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        });
    },

    getWaitingPaymentCount: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `
           SELECT count(p.id) as count from payments p where p.user_id = '${userId}' and p.status = 'WAITING_FOR_PAYMENT'
            `;
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result != 0) {
                        resolve(result[0].count)
                    } else {
                        resolve(0)
                    }
                }
            })
        });
    },

    getOrderItems: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT 
                    p.product_id as product_id,
                    p.name as product_name, 
                    p.description as product_description, 
                    p.stock as product_stock, 
                    (SELECT path FROM product_pictures WHERE product_id = p.product_id LIMIT 1) as product_picture,
                    oi.qty as order_item_quantity, 
                    oi.price as order_item_price, 
                    oi.weight as order_item_weight, 
                    oi.status  as order_item_status, 
                    oi.note as order_item_note
                   
                FROM
                    order_items oi
                LEFT JOIN 
                    products p ON p.product_id = oi.product_id 
                WHERE
                    oi.order_id = '${orderId}' 
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
    getPayment: (paymentId) => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT 
                    * 
                FROM payments
                WHERE
                    payment_id = '${paymentId}'
            `
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
    updatePaymentPaid: (paymentId) => {
        return new Promise((resolve, reject) => {
            var query = `
                UPDATE payments
                SET status = 'PAID', updated_at = '${moment().format()}'
                WHERE
                    payment_id = '${paymentId}'
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
    getAllOrderSellerByPayment: (paymentId) => {
        return new Promise((resolve, reject) => {
            var query = `
                SELECT 
                    o.order_id,
                    s.owner as seller_id
                FROM orders o 
                LEFT JOIN stores s ON s.store_id = o.store_id
                WHERE
                    payment_id = '${paymentId}'
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

    reviewedAllProductOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            var query = `
                UPDATE order_items SET status = 'REVIEWED', updated_at = '${moment().format()}' WHERE order_id = '${orderId}'
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