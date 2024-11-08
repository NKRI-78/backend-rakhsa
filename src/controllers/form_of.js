require("dotenv").config()

const misc = require('../helpers/response')
const formOf = require('../models/FormOf')

module.exports = {

    business: async (_, res) => {
        try {

            var business = await formOf.business()
           
            misc.response(res, 200, false, "", business)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }, 

    businessDetail: async (req, res) => {
        const { id } = req.body
        
        try {

            if(id == "" || typeof id == "undefined")
                throw new Error("id wajib diisi")

            var businessDetail = await formOf.businessDetail(id)

            if(businessDetail.length == 0)
                throw new Error("Form Of tidak ditemukan")

            var data = {
                uid: businessDetail[0].id,
                name: businessDetail[0].name
            } 

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    businessDelete: async (req, res) => {
        const { id } = req.body

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkBusiness = await formOf.checkBusiness(id)
            if(checkBusiness.length == 0) 
                throw new Error("Business tidak ditemukan")

            await formOf.deleteBusiness(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },
    
    createOrUpdateBusiness: async (req, res) => {
        const { id, name } = req.body 
        
        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")
 
            if(typeof name == "undefined" || name == "") 
                throw new Error("name wajib diisi")

            await formOf.createOrUpdateBusiness(id, name)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    classification: async (_, res) => {
        try {

            var classification = await formOf.classification()

            misc.response(res, 200, false, "", classification)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    classificationDetail: async (req, res) => {
        const { id } = req.body
        
        try {

            if(id == "" || typeof id == "undefined")
                throw new Error("id wajib diisi")

            var classificationDetail = await formOf.classificationDetail(id)

            if(classificationDetail.length == 0)
                throw new Error("Classification Of tidak ditemukan")

            var data = {
                uid: classificationDetail[0].id,
                name: classificationDetail[0].name
            } 

            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    classificationDelete: async (req, res) => {
        const { id } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            var checkClassification = await formOf.checkClassification(id)
            if(checkClassification.length == 0) 
                throw new Error("Classification tidak ditemukan")

            await formOf.deleteClassification(id)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, )
        }
    },

    createOrUpdateClassification: async (req, res) => {
        const { id, name } = req.body 

        try {

            if(typeof id == "undefined" || id == "")
                throw new Error("id wajib diisi")

            if(typeof name == "undefined" || name == "")
                throw new Error("name wajib diisi")

            await formOf.createOrUpdateClassification(id, name)

            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}
