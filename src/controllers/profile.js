const User = require('../models/User')
const Organization = require('../models/Organization')
const misc = require("../helpers/response")
const moment = require("moment")
const utils = require('../helpers/utils')
const ShortUniqueId = require('short-unique-id')

module.exports = {

    self: async (req, res) => {
        const { user_id } = req.body

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id wajib diisi")

            var profile = await User.self(user_id)

            if (profile[0].no_referral == null || profile[0].no_referral == '') {
                const ref = new ShortUniqueId({ length: 6 }).rnd();
                User.setNoReferral(user_id, ref)
                profile[0].no_referral = ref
            }

            var remaining_days

            var checkFulfilledData = await User.checkFulfilledData(user_id)

            if (profile.length != 0) {
                var data = {}

                if (profile[0].reminder_date == null || profile[0].reminder_date == "" || typeof profile[0].reminder_date == "undefined") {
                    remaining_days = 0
                } else {
                    remaining_days = moment(profile[0].reminder_date).diff(new Date(), "days")
                }

                data.id = profile[0].uid ?? ""
                data.avatar = profile[0].avatar ?? ""
                data.fullname = profile[0].fullname ?? ""
                data.email = profile[0].email ?? ""
                data.phone = profile[0].phone ?? ""
                data.role = profile[0].role ?? ""
                data.pic_ktp = profile[0].pic_ktp ?? ""
                data.address_ktp = profile[0].address_ktp ?? ""
                data.no_ktp = profile[0].no_ktp ?? ""
                data.no_member = profile[0].no_member ?? ""
                data.job_id = profile[0].job_id ?? ""
                data.job = profile[0].job ?? ""
                data.organization = profile[0].organization ?? ""
                data.organization_path = profile[0].organization_path ?? ""
                data.organization_bahasa_name = profile[0].bahasa_name ?? ""
                data.organization_english_name = profile[0].english_name ?? ""
                data.member_type = profile[0].member ?? ""
                data.remaining_days = remaining_days
                data.fulfilledData = checkFulfilledData.length != 0 ? true : false,
                data.store_id = profile[0].store_id ?? null
                data.no_referral = profile[0].no_referral

                misc.response(res, 200, false, "", data)
            } else {
                misc.response(res, 400, false, "Pengguna tidak ditemukan")
            }
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    getUsers: async (req, res) => {
        const { username } = req.params

        try {

            if(typeof username == "undefined" || username == "")
                throw new Error("Field username is required")

            var users = await User.getUsers(username)
            
            var dataAssign = []

            for (const i in users) {
                var user = users[i]

                dataAssign.push({
                    id: user.user_id,
                    photo: user.avatar,
                    display: user.fullname
                })
            }

            misc.response(res, 200, false, "", dataAssign)
        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }

    },  

    update: async (req, res) => {
        const {
            user_id, fullname, province, province_id, city, city_id,
            district, district_id, subdistrict, subdistrict_id,
            address_ktp, pic_ktp, no_ktp, avatar
        } = req.body

        var fullname_assign = fullname
        var pic_ktp_assign = pic_ktp
        var address_ktp_assign = address_ktp
        var no_ktp_assign = no_ktp
        var avatar_assign = avatar
        var province_assign = province
        var city_assign = city
        var district_assign = district
        var subdistrict_assign = subdistrict

        try {

            var profiles = await User.self(user_id)

            if (profiles.length == 0)
                throw new Error("Pengguna tidak ditemukan")

            var profile = profiles[0]

            var checkUserOrganizations = await Organization.checkUserOrganizations(user_id)
            if (checkUserOrganizations.length == 0)
                throw new Error("Pengguna tidak memiliki organisasi")

            if (typeof avatar == "undefined" || avatar == '')
                avatar_assign = profile.avatar ?? ""

            if (typeof fullname == "undefined" || fullname == '')
                fullname_assign = profile.fullname ?? ""

            if (typeof pic_ktp == "undefined" || pic_ktp == '')
                pic_ktp_assign = profile.pic_ktp ?? ""

            if (typeof no_ktp == "undefined" || no_ktp == '')
                no_ktp_assign = profile.no_ktp ?? ""

            if (typeof address_ktp == "undefined" || address_ktp == '')
                address_ktp_assign = profile.address_ktp ?? ""

            if(typeof province == "undefined") 
                province_assign = profile.province ?? ""

            if(typeof city == "undefined")
                city_assign = profile.city ?? ""

            if(typeof district == "undefined")
                district_assign = profile.district ?? ""

            if(typeof subdistrict == "undefined")
                subdistrict_assign = profile.subdistrict ?? ""

            if(typeof avatar == "undefined" || avatar == "") {

                var checkUsername = await User.checkUsername(fullname_assign)

                if(checkUsername.length != 0)
                    throw new Error("Nama Pengguna sudah ada")

            }

            if (typeof province != "undefined" && typeof province_id != "undefined"
                && typeof city != "undefined" && typeof city_id != "undefined"
                && typeof district != "undefined" && typeof district_id != "undefined"
                && typeof subdistrict != "undefined" && typeof subdistrict_id != "undefined") {

                var checkLastNoMember = await Organization.checkLastNoMember()

                var counterNumber = 1

                if (checkLastNoMember.length != 0)
                    counterNumber = checkLastNoMember[0].no + 1

                var noMember = `${checkUserOrganizations[0].name.toUpperCase()}-${new Date().getFullYear()}.${province_id}.${city_id}.${utils.pad(7, `${counterNumber}${province_id}`, '0')}`

                await Organization.updateNoMember(noMember, counterNumber, user_id)
            }

            await User.update(
                user_id, avatar_assign, fullname_assign, address_ktp_assign,
                pic_ktp_assign, no_ktp_assign, province_assign, city_assign, district_assign, subdistrict_assign,
            )

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    generateProvinceCity: async (_, res) => {
        try {
            const users = await User.getUserNullProvinceCity();
            var generate_users = users;

            for (let index = 0; index < users.length; index++) {
                const user = users[index];
                var no_member = user.no_member;
                var province_id = no_member.split(".")[1];
                var city_id = no_member.split(".")[2];
                generate_users[index].province_id = province_id;
                generate_users[index].city_id = city_id;
            }

            misc.response(res, 200, false, "", generate_users)
        } catch (error) {
            misc.response(res, 400, true, error.message)
        }
    }

}