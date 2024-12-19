require("dotenv").config()

const misc = require('../helpers/response')
const Admin = require("../models/Admin")
const Auth = require("../models/Auth")
const User = require("../models/User")

const { v4: uuidv4 } = require('uuid')

module.exports = {

    listUser: async (_, res) => {
        try {

            var users = await User.listUser()

            var data = []

            for (const i in users) {
                var user = users[i]
                
                data.push({
                    id: user.user_id,
                    avatar: user.avatar,
                    username: user.username, 
                    fullname: user.fullname,
                    address: user.address,
                    email: user.email,
                    phone: user.phone,
                    nik: user.nik,
                    emergency_contact: user.emergency_contact
                })
            }


            misc.response(res, 200, false, "", data)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    assignUserKbri: async (req, res) => {
        const { user_id, continent_id, state_id, city_id } = req.body
        
        try {

            if(typeof user_id == "undefined" || user_id == "")
                throw new Error("Field user_id is required")

            if(typeof continent_id == "undefined" || continent_id == "")
                throw new Error("Field continent_id is required")

            if(typeof state_id == "undefined" || state == "")
                throw new Error("Field state_id is required")

            if(typeof city_id == "undefined" || city == "")
                throw new Error("Field city_id is required")

            await Admin.assignUserKbri(user_id, continent_id, state_id, city_id)

            misc.response(res, 200, false, "")

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    createUser: async (req, res) => {
        
        const { email, avatar, fullname, address, username, passport, password, phone } = req.body
        
        try {

            if(typeof email == "undefined" || email == "")
                throw new Error("Field email is required")

            if(typeof avatar == "undefined" || avatar == "")
                throw new Error("Field avatar is required")

            if(typeof fullname == "undefined" || fullname == "")
                throw new Error("Field fullname is required")

            if(typeof address == "undefined" || address == "")
                throw new Error("Field address is required")

            if(typeof username == "undefined" || username == "")
                throw new Error("Field username is required")

            if(typeof passport == "undefined" || passport == "")
                throw new Error("Field passport is required")

            if(typeof password == "undefined" || password == "")
                throw new Error("Field password is required")

            if(typeof phone == "undefined" || phone == "")
                throw new Error("Field phone is required")

            var userId = uuidv4()
            
            await User.createUser(userId, fullname, avatar, address, passport)

            await Auth.createUser(userId, email, username, phone, password)

            misc.response(res, 200, false, "")

        } catch(e) {
            
            console.log(e)
            misc.response(res, 400, true, e.message)

        } 
    }

}
