const conn = require('../configs/db_payment')

module.exports = {

    getAllPaymentChannel: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM pg_channels`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getAllPaymentChannelV2: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT 
            payment_code as channel,
            category,
            status,
            payment_guide as guide,
            min_amount as minAmount,
            payment_name as name,
            payment_code,
            payment_description,
            payment_gateway,
            payment_logo,
            payment_method,
            payment_name,
            payment_url,
            total_admin_fee
            FROM pg_channels`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getPaymentChannel: (paymentCode) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT payment_name 
            FROM pg_channels WHERE payment_code = '${paymentCode}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getPayment: (paymentChannel) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT invoice_url, payment_code, expired, 
            payment_guide, payment_admin_fee, payment_guide_url 
            FROM pg_payments WHERE payment_channel = '${paymentChannel}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getPaymentByTrxId: (trxId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT *
            FROM pg_payments WHERE billing_no = '${trxId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0])
                    } else {
                        reject(new Error("not found"))
                    }
                }
            })
        })
    },

    getOneItemPayment: (payment_id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT *
            FROM pg_payment_details WHERE payment_id = '${payment_id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    resolve(null)
                } else {
                    if (result.length != 0) {
                        resolve(result[0])
                    } else {
                        resolve(null)
                    }
                }
            })
        })
    }

}