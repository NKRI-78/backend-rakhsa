const conn = require('../configs/db')

module.exports = {

    getAccountPriceList: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT * FROM pricelist WHERE type = "account_subs"`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getAccountPackageMonth: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT data FROM pricelist WHERE type = "account_subs" AND id = "${id}"`
            conn.query(query, (e, result) => {
                if (e) {
                    resolve(1)
                } else {
                    if (result.length == 0) {
                        resolve(1)
                    } else {
                        resolve(result[0].data)
                    }
                }
            })
        })
    },

}