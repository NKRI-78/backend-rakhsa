const conn = require("../configs/db")

module.exports = {

    maintenance: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT maintenance FROM maintenances`
            conn.query(query, (e, result) => {
            if(e) {
                reject(new Error(e))
            } else {
                resolve(result)
            }
        })
      })
    },

    showDemo: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT showdemo FROM hiddens`
            conn.query(query, (e, result) => {
            if(e) {
                reject(new Error(e))
            } else {
                resolve(result)
            }
        })
      })
    },

}