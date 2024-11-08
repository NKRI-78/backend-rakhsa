const escapeQuotes = require('escape-quotes')
const conn = require('../configs/db')

module.exports = {
    assignShippingAddress: (data) => {
        var query = `INSERT INTO shipping_address 
        (shipping_address_id, user_id, phone_number,address, postal_code, province, city, district, subdistrict, tariff_code, name, lat, lng, default_location, label) 
        VALUES('${data.uid}', '${data.userId}', '${data.phone_number}','${data.address}', '${data.postal_code}', '${data.province}', 
        '${data.city}', '${data.district}', '${data.subdistrict}', '${data.tariff_code}', '${data.name}', '${data.lat}', '${data.lng}', '${data.default_location}', '${data.label}')
        ON DUPLICATE KEY UPDATE address = '${data.address}', phone_number = '${data.phone_number}',postal_code = '${data.postal_code}', province = '${data.province}',
        city = '${data.city}', district = '${data.district}', subdistrict = '${data.subdistrict}', tariff_code = '${data.tariff_code}', name = '${data.name}', lat = '${data.lat}', lng = '${data.lng}',
        default_location = '${data.default_location}', label = '${data.label}'
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

    getJNEDestination: (subdistrict) => {
        var query = `SELECT * FROM jne_destinations WHERE subdistrict_name LIKE '%${subdistrict}%'`

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

    getJNEDestinationTarifCode: (city, zip_code) => {
        var query = `SELECT tariff_code FROM jne_destinations WHERE zip_code = '${zip_code}' AND city_name LIKE '%${city}%'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0].tariff_code)
                    }
                    else {
                        reject(new Error("Not Found"))
                    }
                }
            })
        })
    },

    selectPrimaryAddress: (data) => {
        var query = `UPDATE shipping_address 
        SET default_location 
        = CASE shipping_address_id 
            WHEN '${data.id}' THEN '1'
            ELSE '0'
        END WHERE user_id = '${data.userId}'`

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

    findAllById: (userId) => {
        var query = `Select * From shipping_address where user_id = '${userId}'`

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
    getShippingAddressPrimaryInfo: (userId) => {
        var query = `SELECT a.shipping_address_id, a.address, 
        a.province, a.city, a.district, a.subdistrict, a.name, a.lat, a.lng,
        a.postal_code, a.default_location 
        FROM shipping_address a 
        WHERE default_location = '1' 
        AND a.user_id = '${userId}'`

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
    getShippingAddressInfo: (data) => {
        var query = `SELECT a.shipping_address_id, a.address, 
        a.province, a.city, a.district, a.subdistrict, a.name, a.lat, a.lng,
        a.postal_code, a.default_location 
        FROM shipping_address a WHERE a.shipping_address_id = '${data.id}' 
        AND a.user_id = '${data.userId}'`

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

    destroy: (data) => {
        var query = `
        DELETE FROM shipping_address WHERE shipping_address_id = '${data.shipping_address_id}' AND user_id = '${data.user_id}'
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

}