const { v4: uuidv4 } = require('uuid')
const misc = require('../helpers/response')
const Jne = require('../models/Jne')
const Store = require('../models/Store')
const escapeQuotes = require('escape-quotes')
const utils = require('../helpers/utils')

module.exports = {

    createOrUpdate: async (req, res) => {

        var {
            owner, name,
            description, picture,
            province, city,
            district,
            subdistrict,
            postal_code, address,
            email, phone, open,
            lat, lng
        } = req.body

        const storeEdited = await Store.getStoreByOwner()

        try {

            if (typeof name == "undefined" || name == "")
                name = storeEdited[0].name

            if (typeof description == "undefined" || description == "")
                description = storeEdited[0].description

            if (typeof picture == "undefined" || picture == "")
                picture = storeEdited[0].picture

            if (typeof province == "undefined" || province == "")
                province = storeEdited[0].province

            if (typeof city == "undefined" || city == "")
                city = storeEdited[0].city

            if (typeof district == "undefined" || district == "")
                district = storeEdited[0].district

            if (typeof subdistrict == "undefined" || subdistrict == "")
                subdistrict = storeEdited[0].subdistrict

            if (typeof postal_code == "undefined" || postal_code == "")
                postal_code = storeEdited[0].postal_code

            if (typeof address == "undefined" || address == "")
                address = storeEdited[0].address

            if (typeof email == "undefined" || email == "")
                email = storeEdited[0].email

            if (typeof phone == "undefined" || phone == "")
                phone = storeEdited[0].phone

            if (typeof open == "undefined" || open == "")
                open = storeEdited[0].open

            var cityFilter

            if (city.split(' ').length > 1) {
                cityFilter = city.split(' ')[0]
            } else {
                cityFilter = city
            }

            const getJneOrigin = await Jne.getOriginJneByCity(cityFilter)

            var data = {
                id: uuidv4(),
                owner: owner,
                name: name,
                email: email,
                description: escapeQuotes(description),
                picture: picture,
                province: province,
                city: city,
                district: district,
                subdistrict: subdistrict,
                postal_code: postal_code,
                phone: phone,
                origin_code: getJneOrigin[0].origin_code,
                address: address,
                status: '1',
                lat: lat,
                lng: lng,
                open: open,
            }

            await Store.createStore(data)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    getAllStore: async (_, res) => {
        try {

            const stores = await Store.getAllStore()

            var data = []

            for (var i = 0; i < stores.length; i++) {
                var store = stores[i]

                const supportedCouriers = await Store.getSupportedCouriers()

                var couriers = []

                for (var z in supportedCouriers) {
                    couriers.push({
                        name: couriers[z].courier_id
                    })
                }

                data.push({
                    id: store.store_id,
                    owner: store.owner,
                    name: store.name,
                    description: store.description,
                    picture: store.picture,
                    province: store.province,
                    city: store.city,
                    subdistrict: store.subdistrict,
                    postal_code: store.postal_code,
                    address: store.address,
                    email: store.email,
                    phone: store.phone,
                    lat: store.lat,
                    lng: store.lng,
                    open: store.open == 1 ? true : false,
                    status: store.status == 1 ? true : false,
                    approved: store.approved == 1 ? true : false,
                    supported_couriers: couriers,
                    creted_at: utils.formatDate(store.created_at),
                    updated_at: utils.formatDate(store.updated_at)
                })
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    getStoreInfo: async (req, res) => {
        const { id } = req.body

        try {

            const stores = await Store.getStoreInfo(id)

            var data = []

            for (var i = 0; i < stores.length; i++) {
                var store = stores[i]

                // const couriers = await Store.getSupportedCouriers()

                // var supportedCouriers = []

                // for (var z in couriers) {
                //     supportedCouriers.push({
                //         name: couriers[z].courier_id
                //     });
                // }

                data.push({
                    id: store.store_id,
                    owner: store.owner,
                    name: store.name,
                    description: store.description,
                    picture: store.picture,
                    province: store.province,
                    city: store.city,
                    district: store.district,
                    subdistrict: store.subdistrict,
                    postal_code: store.postal_code,
                    address: store.address,
                    email: store.email,
                    phone: store.phone,
                    lat: store.lat,
                    lng: store.lng,
                    open: store.open == 1 ? true : false,
                    status: store.status == 1 ? true : false,
                    // supported_couriers: supportedCouriers,
                    creted_at: utils.formatDate(store.created_at),
                    updated_at: utils.formatDate(store.updated_at)
                })
            }

            misc.response(res, 200, false, "", stores[0])
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}