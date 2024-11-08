const Organization = require("../models/Organization")
const User = require("../models/User")
const misc = require("../helpers/response")

const { v4: uuidv4 } = require('uuid')
const escapeQuotes = require("escape-quotes")

module.exports = {

    all: async (_, res) => {
        try {   
            var organizations = await Organization.all()

            var data = []

            for(z in organizations) {
                var organization = organizations[z]
                data.push({
                    id: organization.uid,
                    name: organization.name,
                    bahasa_name: organization.bahasa_name ?? "", 
                    english_name: organization.english_name ?? "",
                    path: organization.path ?? ""
                })
            }

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    detail: async(req, res) => {
        const { id } = req.body

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var organizations = await Organization.detail(id)
            if(organizations.length == 0)
                throw new Error("Organisasi tidak ditemukan")

            var data = {
                id: organizations[0].uid,
                name: organizations[0].name,
                path: organizations[0].path, 
                bahasa_name: organizations[0].bahasa_name,
                english_name: organizations[0].english_name
            }
            
            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    createOrUpdate: async (req, res) => {
        const { id, name, bahasa_name, english_name, path } = req.body

        try {

            if(typeof id == "undefined" || id == "") 
                throw new Error("id wajib diisi")

            if(typeof name == "undefined" || name == "") 
                throw new Error("name wajib diisi")

            await Organization.createOrUpdate(id, name, bahasa_name ?? "", english_name ?? "", escapeQuotes(path) ?? "")

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    createOrUpdateDataLeaders: async (req, res) => {
        const { name_instance, address_instance, province_id, province, city_id, city, 
            district_id, district, subdistrict_id, subdistrict,
            form_of_business, form_of_classification, user_id
        } = req.body 

        try {

            if(typeof name_instance == "undefined" || name_instance == "")
                throw new Error("name_instance wajib diisi")

            if(typeof address_instance == "undefined" || address_instance == "")
                throw new Error("address_instance wajib diisi")

            if(typeof province_id == "undefined" || province_id == "")
                throw new Error("province_id wajib diisi")

            if(typeof province == "undefined" || province == "")
                throw new Error("province wajib diisi")

            if(typeof city_id == "undefined" || city_id == "")
                throw new Error("city_id wajib diisi")

            if(typeof city == "undefined" || city == "")
                throw new Error("city wajib diisi")
            
            if(typeof district_id == "undefined" || district_id == "")
                throw new Error("district_id wajib diisi")
            
            if(typeof district == "undefined" || district == "")
                throw new Error("district wajib diisi")

            if(typeof subdistrict_id == "undefined" || subdistrict_id == "")
                throw new Error("subdistrict_id wajib diisi")

            if(typeof subdistrict == "undefined" || subdistrict == "")
                throw new Error("subdistrict wajib diisi")
            
            if(typeof form_of_business == "undefined" || form_of_business == "")
                throw new Error("form_of_business wajib diisi")

            if(typeof form_of_classification == "undefined" || form_of_classification == "")
                throw new Error("form_of_classification wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkFormOfBusinesses = await Organization.checkFormOfBusinesses(form_of_business)
            if(checkFormOfBusinesses.length == 0)
                throw new Error("Form Of Businesses tidak ditemukan") 

            var checkFormOfClassifications = await Organization.checkFormOfClassifications(form_of_classification)
            if(checkFormOfClassifications.length == 0)
                throw new Error("Form Of Classifications tidak ditemukan") 

            var checkUsers = await User.checkUsers(user_id)
            if(checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Organization.createOrUpdateDataLeaders(
                uuidv4(), name_instance, address_instance, 
                province_id, province, city_id, city,
                district_id, district, subdistrict_id, subdistrict,
                form_of_business, form_of_classification, user_id
            )

            misc.response(res, 200, false, "")                
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createOrUpdateDataEducators: async (req, res) => {
        const { name_instance, address_instance, province_id, province, city_id, city, 
            district_id, district, subdistrict_id, subdistrict,
            form_of_business, form_of_classification, user_id
        } = req.body 

        try {

            if(typeof name_instance == "undefined" || name_instance == "")
                throw new Error("name_instance wajib diisi")

            if(typeof address_instance == "undefined" || address_instance == "")
                throw new Error("address_instance wajib diisi")

            if(typeof province_id == "undefined" || province_id == "")
                throw new Error("province_id wajib diisi")

            if(typeof province == "undefined" || province == "")
                throw new Error("province wajib diisi")

            if(typeof city_id == "undefined" || city_id == "")
                throw new Error("city_id wajib diisi")

            if(typeof city == "undefined" || city == "")
                throw new Error("city wajib diisi")
            
            if(typeof district_id == "undefined" || district_id == "")
                throw new Error("district_id wajib diisi")
            
            if(typeof district == "undefined" || district == "")
                throw new Error("district wajib diisi")

            if(typeof subdistrict_id == "undefined" || subdistrict_id == "")
                throw new Error("subdistrict_id wajib diisi")

            if(typeof subdistrict == "undefined" || subdistrict == "")
                throw new Error("subdistrict wajib diisi")
            
            if(typeof form_of_business == "undefined" || form_of_business == "")
                throw new Error("form_of_business wajib diisi")

            if(typeof form_of_classification == "undefined" || form_of_classification == "")
                throw new Error("form_of_classification wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkFormOfBusinesses = await Organization.checkFormOfBusinesses(form_of_business)
            if(checkFormOfBusinesses.length == 0)
                throw new Error("Form Of Businesses tidak ditemukan") 

            var checkFormOfClassifications = await Organization.checkFormOfClassifications(form_of_classification)
            if(checkFormOfClassifications.length == 0)
                throw new Error("Form Of Classifications tidak ditemukan") 

            var checkUsers = await User.checkUsers(user_id)
            if(checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Organization.createOrUpdateDataEducators(
                uuidv4(), name_instance, address_instance, 
                province_id, province, city_id, city,
                district_id, district, subdistrict_id, subdistrict,
                form_of_business, form_of_classification, user_id
            )

            misc.response(res, 200, false, "")             
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createOrUpdateDataTrainnings: async (req, res) => {
        const { name_instance, address_instance, province_id, province, city_id, city, 
            district_id, district, subdistrict_id, subdistrict,
            form_of_business, form_of_classification, user_id
        } = req.body 

        try {

            if(typeof name_instance == "undefined" || name_instance == "")
                throw new Error("name_instance wajib diisi")

            if(typeof address_instance == "undefined" || address_instance == "")
                throw new Error("address_instance wajib diisi")

            if(typeof province_id == "undefined" || province_id == "")
                throw new Error("province_id wajib diisi")

            if(typeof province == "undefined" || province == "")
                throw new Error("province wajib diisi")

            if(typeof city_id == "undefined" || city_id == "")
                throw new Error("city_id wajib diisi")

            if(typeof city == "undefined" || city == "")
                throw new Error("city wajib diisi")
            
            if(typeof district_id == "undefined" || district_id == "")
                throw new Error("district_id wajib diisi")
            
            if(typeof district == "undefined" || district == "")
                throw new Error("district wajib diisi")

            if(typeof subdistrict_id == "undefined" || subdistrict_id == "")
                throw new Error("subdistrict_id wajib diisi")

            if(typeof subdistrict == "undefined" || subdistrict == "")
                throw new Error("subdistrict wajib diisi")
            
            if(typeof form_of_business == "undefined" || form_of_business == "")
                throw new Error("form_of_business wajib diisi")

            if(typeof form_of_classification == "undefined" || form_of_classification == "")
                throw new Error("form_of_classification wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkFormOfBusinesses = await Organization.checkFormOfBusinesses(form_of_business)
            if(checkFormOfBusinesses.length == 0)
                throw new Error("Form Of Businesses tidak ditemukan") 

            var checkFormOfClassifications = await Organization.checkFormOfClassifications(form_of_classification)
            if(checkFormOfClassifications.length == 0)
                throw new Error("Form Of Classifications tidak ditemukan") 

            var checkUsers = await User.checkUsers(user_id)
            if(checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Organization.createOrUpdateDataTrainnings(
                uuidv4(), name_instance, address_instance, 
                province_id, province, city_id, city,
                district_id, district, subdistrict_id, subdistrict,
                form_of_business, form_of_classification, user_id
            )

            misc.response(res, 200, false, "")   
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createOrUpdateDataEnterpreneurs: async (req, res) => {
        const { name_instance, address_instance, province_id, province, city_id, city, 
            district_id, district, subdistrict_id, subdistrict,
            employee_count, person_responsible, no_person_responsible,
            form_of_business, form_of_classification, user_id
        } = req.body

        try {

            if(typeof name_instance == "undefined" || name_instance == "")
                throw new Error("name_instance wajib diisi")

            if(typeof address_instance == "undefined" || address_instance == "")
                throw new Error("address_instance wajib diisi")

            if(typeof province_id == "undefined" || province_id == "")
                throw new Error("province_id wajib diisi")

            if(typeof province == "undefined" || province == "")
                throw new Error("province wajib diisi")

            if(typeof city_id == "undefined" || city_id == "")
                throw new Error("city_id wajib diisi")

            if(typeof city == "undefined" || city == "")
                throw new Error("city wajib diisi")
            
            if(typeof district_id == "undefined" || district_id == "")
                throw new Error("district_id wajib diisi")
            
            if(typeof district == "undefined" || district == "")
                throw new Error("district wajib diisi")

            if(typeof subdistrict_id == "undefined" || subdistrict_id == "")
                throw new Error("subdistrict_id wajib diisi")

            if(typeof subdistrict == "undefined" || subdistrict == "")
                throw new Error("subdistrict wajib diisi")
            
            if(typeof employee_count == "undefined" || employee_count == "")
                throw new Error("employee_count wajib diisi")
            
            if(typeof person_responsible == "undefined" || person_responsible == "")
                throw new Error("person_responsible wajib diisi")

            if(typeof no_person_responsible == "undefined" || no_person_responsible == "")
                throw new Error("no_person_responsible wajib diisi")

            if(typeof form_of_business == "undefined" || form_of_business == "")
                throw new Error("form_of_business wajib diisi")

            if(typeof form_of_classification == "undefined" || form_of_classification == "")
                throw new Error("form_of_classification wajib diisi")

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var checkFormOfBusinesses = await Organization.checkFormOfBusinesses(form_of_business)
            if(checkFormOfBusinesses.length == 0)
                throw new Error("Form Of Businesses tidak ditemukan") 

            var checkFormOfClassifications = await Organization.checkFormOfClassifications(form_of_classification)
            if(checkFormOfClassifications.length == 0)
                throw new Error("Form Of Classifications tidak ditemukan") 

            var checkUsers = await User.checkUsers(user_id)
            if(checkUsers.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            await Organization.createOrUpdateDataEnterpreneurs(
                uuidv4(), name_instance, address_instance, 
                province_id, province, city_id, city,
                district_id, district, subdistrict_id, subdistrict,
                employee_count, person_responsible, no_person_responsible,
                form_of_business, form_of_classification, user_id
            )

            misc.response(res, 200, false, "")  
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    delete: async (req, res) => {
        const { id } = req.body

        try {
            
            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkOrganizations = await Organization.checkOrganizations(id)
            if(checkOrganizations.length == 0)
                throw new Error("Organisasi tidak ditemukan")

            await Organization.delete(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}