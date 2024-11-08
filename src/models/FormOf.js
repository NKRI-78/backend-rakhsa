const conn = require('../configs/db')

module.exports = {

    business: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid AS id, name FROM form_of_businesses`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    businessDetail: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid AS id, name FROM form_of_businesses WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateBusiness: (id, name) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO form_of_businesses (uid, name) VALUES ('${id}', '${name}')
            ON DUPLICATE KEY UPDATE name = '${name}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkBusiness: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT name FROM form_of_businesses WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteBusiness: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM form_of_businesses WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    classification: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid AS id, name FROM form_of_classifications`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    classificationDetail: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid AS id, name FROM form_of_classifications WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateClassification: (id, name) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO form_of_classifications (uid, name) VALUES ('${id}', '${name}') 
            ON DUPLICATE KEY UPDATE name = '${name}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkClassification: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT name FROM form_of_classifications WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteClassification: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM form_of_classifications WHERE uid = '${id}'`
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