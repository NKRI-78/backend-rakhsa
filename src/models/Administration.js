const conn = require('../configs/db')
const connFSPMI = require('../configs/db_fspmi')

module.exports = {

    provinces: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT province_name FROM administrations 
            GROUP BY province_name`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    provincesFSPMI: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT id, code, name FROM fspmi_provinces`
            connFSPMI.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    cities: (provinceName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT city_name FROM administrations 
            WHERE province_name = '${provinceName}'
            GROUP BY city_name`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    citiesFSPMI: (provinceId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT code, name FROM fspmi_cities WHERE province_id = '${provinceId}'`
            connFSPMI.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    districts: (cityName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT district_name FROM administrations 
            WHERE city_name = '${cityName}'
            GROUP BY district_name`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    subdistricts: (districtName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT subdistrict_name FROM administrations 
            WHERE district_name = '${districtName}'
            GROUP BY subdistrict_name`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
    postalCodes: (subDistrictName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT zip_code FROM jne_destinations 
            WHERE subdistrict_name = '${subDistrictName}'
            GROUP BY zip_code`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    postalCodesV2: (cityName, districtName) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT zip_code, subdistrict_name FROM jne_destinations 
            WHERE district_name = '${districtName}' AND city_name = '${cityName}'
            GROUP BY zip_code`
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