
const misc = require("../helpers/response")
const { decodeToken } = require('../helpers/decode')
const ShippingAddress = require('../models/ShippingAddress')


module.exports = {
    assignShippingAddress: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"));
        const userId = decoded.uid;
        try {
            const {
                uid, address, postal_code, province, city,
                district, subdistrict, name,
                lat, lng, default_location, phone_number,
                label,
            } = req.body;

            const getJNEDestination = await ShippingAddress.getJNEDestination(subdistrict);

            const data = {
                uid: uid,
                userId: userId,
                address: address,
                postal_code: postal_code,
                province: province,
                city: city,
                district: district,
                subdistrict: subdistrict,
                phone_number: phone_number,
                tariff_code: getJNEDestination[0].tariff_code,
                name: name, lat: lat, lng: lng,
                default_location: default_location == true ? '1' : '0',
                label: label,
            }

            await ShippingAddress.assignShippingAddress(data);

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },

    selectPrimaryAddress: async (req, res) => {
        const { id } = req.params

        try {
            const decoded = decodeToken(req.get("Authorization"));
            const userId = decoded.uid;

            const data = {
                id: id,
                userId: userId
            }

            await ShippingAddress.selectPrimaryAddress(data);

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    },

    getAllShippingAddress: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"));
            const userId = decoded.uid;

            const shippingAddress = await ShippingAddress.findAllById(userId);

            var shippingAddresses = []
            for (var i in shippingAddress) {
                var address = shippingAddress[i]

                shippingAddresses.push({
                    id: address.id,
                    shipping_address_id: address.shipping_address_id,
                    address: address.address,
                    postal_code: address.postal_code,
                    province: address.province,
                    city: address.city,
                    subdistrict: address.subdistrict,
                    name: address.name,
                    lat: address.lat,
                    lng: address.lng,
                    label: address.label,
                    default_location: parseInt(address.default_location) == 1 ? true : false
                })
            }
            misc.response(res, 200, false, "", shippingAddresses)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, "Internal server error")
        }
    },

    getShippingAddressPrimaryInfo: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"));
            const userId = decoded.uid;

            const results = await ShippingAddress.getShippingAddressPrimaryInfo(userId);

            // await db.query(`DELETE FROM checkout_couriers WHERE user_id = '${userId}'`);

            if (results.length == 0)
                return misc.response(res, 400, false, "shipping-address-is-empty");

            var o = {}
            o.shipping_address_id = results[0].shipping_address_id
            o.address = results[0].address
            o.postal_code = results[0].postal_code
            o.province = results[0].province
            o.city = results[0].city
            o.district = results[0].district
            o.subdistrict = results[0].subdistrict
            o.name = results[0].name
            o.lat = results[0].lat
            o.lng = results[0].lng
            o.label = results[0].label
            o.default_location = parseInt(results[0].default_location) == 1 ? true : false

            misc.response(res, 200, false, "", o);
        } catch (_) {
            misc.response(res, 400, false, "Internal server error");
        }
    },

    getShippingAddressInfo: async (req, res) => {
        const { id } = req.params;

        try {
            const decoded = decodeToken(req.get("Authorization"));
            const userId = decoded.uid;

            const data = {
                id: id,
                userId: userId
            }

            const results = await ShippingAddress.getShippingAddressInfo(data);

            if (results.length == 0)
                return misc.response(res, 400, false, "shipping-address-is-empty");

            var o = {}
            o.shipping_address_id = results[0].shipping_address_id
            o.address = results[0].address
            o.postal_code = results[0].postal_code
            o.province = results[0].province
            o.city = results[0].city
            o.district = results[0].district
            o.subdistrict = results[0].subdistrict
            o.name = results[0].name
            o.lat = results[0].lat
            o.lng = results[0].lng
            o.label = results[0].label
            o.default_location = parseInt(results[0].default_location) == 1 ? true : false

            misc.response(res, 200, false, "", o);
        } catch (_) {
            misc.response(res, 400, false, "Internal server error");
        }
    },

    deleteShippingAddress: async (req, res) => {
        const { shipping_address_id } = req.body;

        try {
            const decoded = decodeToken(req.get("Authorization"));
            const userId = decoded.uid;

            const data = {
                shipping_address_id: shipping_address_id,
                user_id: userId
            }

            await ShippingAddress.destroy(data)

            misc.response(res, 200, false, "");
        } catch (_) {
            misc.response(res, 400, false, "Internal server error");
        }
    }
}


