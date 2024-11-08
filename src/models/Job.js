const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, name FROM jobs`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },  

    checkJobs: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT name FROM jobs WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, name) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO jobs (uid, name) VALUES ('${id}', '${name}') 
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

    detail: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `SELECT uid, name FROM jobs WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if(e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createUserJobs: (userId, jobId) => {
        return new Promise ((resolve, reject) => {
            var query = `INSERT INTO user_jobs (user_id, job_id) VALUES ('${userId}', '${jobId}') 
            ON DUPLICATE KEY UPDATE user_id = '${userId}', job_id = '${jobId}'`
            conn.query(query, (e, result) => {
            if(e) {
                reject(new Error(e))
            } else {
                resolve(result)
            }
        })
      })
    },

    delete: (id) => {
        return new Promise ((resolve, reject) => {
            var query = `DELETE FROM jobs WHERE uid = '${id}'`
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