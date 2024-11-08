const conn = require('../configs/db')

module.exports = {

    invoice: (invoiceDate) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT * FROM invoices WHERE date_value = '${invoiceDate}' ORDER BY no DESC LIMIT 1`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    insert: (invoiceDate, counterNumber, invoiceValue, transactionId) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO invoices (no, value, date_value, transaction_id) 
            VALUES ('${counterNumber}', '${invoiceValue}', '${invoiceDate}', '${transactionId}')`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },


    delete: (transactionId) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM invoices WHERE transaction_id = '${transactionId}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    }

}