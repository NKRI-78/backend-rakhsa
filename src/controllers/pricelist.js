const misc = require("../helpers/response")
const model = require("../models/Pricelist")

module.exports = {
    priceAccountList: async (req, res) => {
        try {
            const data = await model.getAccountPriceList();
            misc.response(res, 200, true, "", data)
        } catch (error) {
            misc.response(res, 400, true, error.message)
        }
    }
}