const misc = require("../helpers/response")
const utils = require("../helpers/utils")
const Invoice = require("../models/Invoice")
const Payment = require("../models/Payment")
const Inbox = require("../models/Inbox")
const Fcm = require("../models/Fcm")
const axios = require("axios")
const moment = require("moment")
const User = require("../models/User")

const { v4: uuidv4 } = require('uuid')
const Transaction = require("../models/Transaction")
const product = require("./product")

module.exports = {

    channel: async (_, res) => {
        try {

            var data = await Payment.getAllPaymentChannel()

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "", data)
        }
    },

    channelV2: async (_, res) => {
        try {

            var channels = await Payment.getAllPaymentChannelV2()

            var data = [];

            for (i in channels) {
                var channel = channels[i];

                if (channel.payment_method != "E_WALLET") {
                    channel.classId = "channel-list";
                    channel.is_direct = true;
                    channel.payment_url_v2 = null;

                    data.push(channel);
                }
            }

            misc.response(res, 200, false, "", data)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, "", data)
        }
    },

    inquiry: async (req, res) => {
        const { user_id, payment_code, package } = req.body

        var transactionId = uuidv4()

        try {

            if (typeof user_id == "undefined" || user_id == "")
                throw new Error("user_id is required")

            if (typeof payment_code == "undefined" || payment_code == "")
                throw new Error("payment_code is required")

            var packages = []
            var amount = 100000;

            if (package != null) {
                amount = package.price;
                packages.push({
                    price: package.price,
                    product_id: package.id,
                    product_name: package.name,
                    quantity: 1,
                    product_code: package.type
                })
            }

            const invoiceDate = moment().format('YYYYMMDD')

            const invoiceData = await Invoice.invoice(invoiceDate)

            function pad(width, string, padding) {
                return (width <= string.length) ? string : pad(width, padding + string, padding)
            }

            var counterNumber = 1

            if (invoiceData.length != 0)
                counterNumber = parseInt(invoiceData[0].no) + 1

            var invoiceValue = 'HP3KIUPGRADE-' + invoiceDate + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000)

            await Transaction.insert(transactionId, user_id)

            await Invoice.insert(invoiceDate, counterNumber, invoiceValue, transactionId)

            const user = await User.self(user_id)

            var data = {
                channel: payment_code,
                total_amount: amount,
                billing_id: invoiceValue,
                billing_uid: user_id,
                billing_phone: user[0].phone,
                billing_email: user[0].email,
                billing_name: user[0].fullname,
                billing_address: "",
                invoice_value: invoiceValue,
                trx_id: invoiceValue,
                trx_desc: "Member Payment HP3KI",
                success_url: "",
                callback_url: process.env.CALLBACK_URL,
                description: "Member Payment HP3KI",
                merchant: "hp3ki",
                app_name: "hp3ki",
                remark: "Member Payment HP3KI",
                item: packages
            }

            console.log(data)

            const r = await axios({
                method: 'POST',
                url: `${process.env.API_PAYMENT_GATEWAY}/payment_v2/api/v1/pay/direct`,
                data: data
            })

            var noVa = r.data.body.payment_code
            var paymentGuide = r.data.body.payment_guide
            var paymentGuideUrl = r.data.body.payment_guide_url

            var fcm = await Fcm.fcmPPOB(user_id)

            if (fcm.length != 0) {
                var token = fcm[0].token

                await utils.sendFCM(`Silahkan Anda melakukan pembayaran sebesar Rp. 100.000 untuk menjadi member platinum !`,
                    paymentGuide, "upgrade", token, '-', '-'
                )
            }

            await Inbox.createInboxPPOB(`Silahkan Anda melakukan pembayaran sebesar Rp. 100.000 untuk menjadi member platinum !`,
                paymentGuide, noVa, paymentGuideUrl, user_id, "HP3KI"
            )

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)

            await Transaction.delete(transactionId)

            await Invoice.delete(transactionId)

            if (typeof e.response != "undefined")
                misc.response(res, 400, true, e.response.data.message)
            else
                misc.response(res, 400, true, e)

        }
    },

}