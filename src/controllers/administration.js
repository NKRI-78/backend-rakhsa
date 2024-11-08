const Administration = require("../models/Administration")
const misc = require("../helpers/response")
const utils = require("../helpers/utils")

module.exports = {

    provinces: async (_, res) => {
        try {

            var provinces = await Administration.provinces()

            var data = []

            for (z in provinces) {
                var province = provinces[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: province.province_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    provincesFSPMI: async (_, res) => {
        try {
            var provinces = await Administration.provincesFSPMI()

            var data = []

            for (z in provinces) {
                var province = provinces[z]
                data.push({
                    id: province.id,
                    code: province.code,
                    name: province.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    citiesFSPMI: async (req, res) => {
        const { province_id } = req.body

        try {
            var cities = await Administration.citiesFSPMI(province_id)

            var data = []

            for (z in cities) {
                var city = cities[z]
                data.push({
                    code: city.code,
                    name: city.name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "Server error")
        }
    },

    cities: async (req, res) => {
        const { province_name } = req.body

        try {

            if (typeof province_name == "undefined" || province_name == "")
                throw new Error("province_name wajib diisi")

            var cities = await Administration.cities(province_name)

            var data = []

            for (z in cities) {
                var city = cities[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: city.city_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    districts: async (req, res) => {
        const { city_name } = req.body

        try {

            if (typeof city_name == "undefined" || city_name == "")
                throw new Error("city_name wajib diisi")

            var districts = await Administration.districts(city_name)

            var data = []

            for (z in districts) {
                var district = districts[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: district.district_name,
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },


    subdistricts: async (req, res) => {
        const { district_name } = req.body

        try {

            if (typeof district_name == "undefined" || district_name == "")
                throw new Error("district_name wajib diisi")

            var subdistricts = await Administration.subdistricts(district_name)

            var data = []

            for (z in subdistricts) {
                var subdistrict = subdistricts[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: subdistrict.subdistrict_name,
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },
    postalCodes: async (req, res) => {
        const { subdistrict_name } = req.body

        try {

            if (typeof subdistrict_name == "undefined" || subdistrict_name == "")
                throw new Error("subdistrict_name wajib diisi")

            var postalcodes = await Administration.postalCodes(subdistrict_name)

            var data = []

            for (z in postalcodes) {
                var posts = postalcodes[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: posts.zip_code,
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    postalCodesV2: async (req, res) => {
        const { city_name, district_name } = req.body
        try {

            if (typeof city_name == "undefined" || city_name == "") {
                throw new Error("city_name wajib diisi")
            }
            if (typeof district_name == "undefined" || district_name == "") {
                throw new Error("district_name wajib diisi")
            }

            var postalcodes = await Administration.postalCodesV2(city_name, district_name)

            var data = []

            for (z in postalcodes) {
                var posts = postalcodes[z]
                data.push({
                    id: utils.isDigit(z) ? `0${z}` : z,
                    name: posts.zip_code,
                    subdistricts_name: posts.subdistrict_name
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}