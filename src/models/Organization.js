const conn = require('../configs/db')

module.exports = {

    all: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, name, bahasa_name, english_name, path FROM organizations 
            GROUP BY name
            ORDER BY created_at ASC`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detail: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT uid, name, path, bahasa_name, english_name, created_at FROM organizations WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdate: (id, name, bahasaName, englishName, path) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT organizations (uid, name, bahasa_name, english_name, path) VALUES ('${id}', '${name}', '${bahasaName}', '${englishName}', '${path}') 
            ON DUPLICATE KEY UPDATE name = '${name}', bahasa_name = '${bahasaName}', english_name = '${englishName}', path = '${path}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateDataLeaders: (id,
        name_instance, address_instance,
        province_id, province,
        city_id, city,
        district_id, district,
        subdistrict_id, subdistrict,
        form_of_business, form_of_classification,
        user_id
    ) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO data_leaders(
                uid, name_instance, address_instance, 
                province_id, province,
                city_id, city,
                district_id, district,
                subdistrict_id, subdistrict, 
                form_of_business, form_of_classification,
                user_id)
                VALUES ('${id}', '${name_instance}', '${address_instance}', 
                '${province_id}', '${province}', '${city_id}', '${city}',
                '${district_id}', '${district}', '${subdistrict_id}', '${subdistrict}',
                '${form_of_business}', '${form_of_classification}', '${user_id}') 
                ON DUPLICATE KEY UPDATE name_instance = '${name_instance}', 
                address_instance = '${address_instance}', province_id = '${province_id}', 
                province = '${province}', city_id = '${city_id}', city = '${city}', 
                district_id = '${district_id}', district = '${district}', 
                subdistrict = '${subdistrict_id}', subdistrict_id = '${subdistrict}', 
                form_of_business = '${form_of_business}', form_of_classification = '${form_of_classification}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateDataEducators: (id,
        name_instance, address_instance,
        province_id, province,
        city_id, city,
        district_id, district,
        subdistrict_id, subdistrict,
        form_of_business, form_of_classification,
        user_id
    ) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO data_educators(
                uid, name_instance, address_instance, 
                province_id, province,
                city_id, city,
                district_id, district,
                subdistrict_id, subdistrict, 
                form_of_business, form_of_classification,
                user_id)
                VALUES ('${id}', '${name_instance}', '${address_instance}', 
                '${province_id}', '${province}', '${city_id}', '${city}',
                '${district_id}', '${district}', '${subdistrict_id}', '${subdistrict}',
                '${form_of_business}', '${form_of_classification}', '${user_id}') 
                ON DUPLICATE KEY UPDATE name_instance = '${name_instance}', 
                address_instance = '${address_instance}', province_id = '${province_id}', 
                province = '${province}', city_id = '${city_id}', city = '${city}', 
                district_id = '${district_id}', district = '${district}', 
                subdistrict = '${subdistrict_id}', subdistrict_id = '${subdistrict}', 
                form_of_business = '${form_of_business}', form_of_classification = '${form_of_classification}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateDataTrainnings: (id,
        name_instance, address_instance,
        province_id, province,
        city_id, city,
        district_id, district,
        subdistrict_id, subdistrict,
        form_of_business, form_of_classification,
        user_id
    ) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO data_trainnings(
                uid, name_instance, address_instance, 
                province_id, province,
                city_id, city,
                district_id, district,
                subdistrict_id, subdistrict, 
                form_of_business, form_of_classification,
                user_id)
                VALUES ('${id}', '${name_instance}', '${address_instance}', 
                '${province_id}', '${province}', '${city_id}', '${city}',
                '${district_id}', '${district}', '${subdistrict_id}', '${subdistrict}',
                '${form_of_business}', '${form_of_classification}', '${user_id}') 
                ON DUPLICATE KEY UPDATE name_instance = '${name_instance}', 
                address_instance = '${address_instance}', province_id = '${province_id}', 
                province = '${province}', city_id = '${city_id}', city = '${city}', 
                district_id = '${district_id}', district = '${district}', 
                subdistrict = '${subdistrict_id}', subdistrict_id = '${subdistrict}', 
                form_of_business = '${form_of_business}', form_of_classification = '${form_of_classification}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createOrUpdateDataEnterpreneurs: (id,
        name_instance, address_instance,
        province_id, province,
        city_id, city,
        district_id, district,
        subdistrict_id, subdistrict,
        employee_count, person_responsible, no_person_responsible,
        form_of_business, form_of_classification,
        user_id
    ) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO data_enterpreneurs(
                uid, name_instance, address_instance, 
                province_id, province,
                city_id, city,
                district_id, district,
                subdistrict_id, subdistrict, 
                employee_count, person_responsible, no_person_responsible,
                form_of_business, form_of_classification,
                user_id)
                VALUES ('${id}', '${name_instance}', '${address_instance}', 
                '${province_id}', '${province}', '${city_id}', '${city}',
                '${district_id}', '${district}', '${subdistrict_id}', '${subdistrict}',
                '${employee_count}', '${person_responsible}', '${no_person_responsible}',
                '${form_of_business}', '${form_of_classification}', '${user_id}') 
                ON DUPLICATE KEY UPDATE name_instance = '${name_instance}', 
                address_instance = '${address_instance}', province_id = '${province_id}', 
                province = '${province}', city_id = '${city_id}', city = '${city}', 
                district_id = '${district_id}', district = '${district}', 
                subdistrict = '${subdistrict_id}', subdistrict_id = '${subdistrict}', 
                employee_count = '${employee_count}', person_responsible = '${person_responsible}', 
                no_person_responsible = '${no_person_responsible}',
                form_of_business = '${form_of_business}', form_of_classification = '${form_of_classification}'`

            console.log(query)
            conn.query(query, (e, result) => {
                if (e) {
                    console.log(`error ${e}`)
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkOrganizations: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT name FROM organizations WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkFormOfBusinesses: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT name FROM form_of_businesses WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkFormOfClassifications: (id) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT name FROM form_of_classifications WHERE uid = '${id}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkUserOrganizations: (userId) => {
        return new Promise((resolve, reject) => {
            var query = `SELECT o.name FROM organizations o 
            INNER JOIN user_organizations uo ON uo.organization_id = o.uid 
            WHERE uo.user_id = '${userId}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    checkLastNoMember: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT no FROM user_no_members ORDER BY no DESC LIMIT 1`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    updateNoMember: (noMember, counterNumber, userId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO user_no_members (no_member, no, user_id) 
                VALUES ('${noMember}', '${counterNumber}', '${userId}')
                ON DUPLICATE KEY UPDATE no_member = '${noMember}'`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    createUserOrganizations: (userId, organizationId) => {
        return new Promise((resolve, reject) => {
            var query = `INSERT INTO user_organizations (user_id, organization_id) VALUES ('${userId}', '${organizationId}')`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    delete: (id) => {
        return new Promise((resolve, reject) => {
            var query = `DELETE FROM organizations WHERE uid = '${id}'`
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