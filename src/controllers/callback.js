const misc = require('../helpers/response')
const utils = require('../helpers/utils')
const Callback = require('../models/Callback')
const moment = require("moment")
const Fcm = require('../models/Fcm')
const User = require('../models/User')
const Inbox = require('../models/Inbox')
const Pricelist = require('../models/Pricelist')
const Order = require('../models/Order')
const Payment = require('../models/Payment')
// const { v4: uuidv4 } = require('uuid')

module.exports = {

    callback: async (req, res) => {
        const { trx_id, amount } = req.query

        try {

            var payment = await Payment.getPaymentByTrxId(trx_id);

            if (payment.payment_status == "PAID") {
                var month = 1;
                var item = await Payment.getOneItemPayment(payment.payment_id)
                if (item != null) {
                    month = await Pricelist.getAccountPackageMonth(item.product_id)
                }

                var userId = payment.billing_uid;
                await Callback.callback(userId, amount)

                await User.updateMemberPayment(userId, month)

                var user = await User.self(userId)

                var fcm = await Fcm.fcmPPOB(userId)

                if (user.length != 0) {

                    var startDate = moment(user[0].reminder_date).subtract(month, 'months').format('DD-MM-YYYY')
                    var endDate = moment(user[0].reminder_date).format('DD-MM-YYYY')

                    if (fcm.length != 0) {
                        var token = fcm[0].token

                        await utils.sendFCM(
                            `Terima kasih karena kamu sudah menjadi anggota Platinum.`,
                            `Selamat keanggotaan platinum anda telah aktif. Periode sampai ${startDate} - ${endDate}`,
                            token,
                            'upgrade',
                            '-',
                            '-'
                        )
                    }

                    await Inbox.createInboxPPOB(
                        `Terima kasih karena kamu sudah menjadi anggota Platinum.`,
                        `Selamat keanggotaan platinum anda telah aktif. Periode sampai ${startDate} - ${endDate}`,
                        '', '-', trx_id, 'HP3KI'
                    )

                } else {
                    throw new Error("User not found")
                }
            }



            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

    callbackEcommerce: async (req, res) => {
        const { trx_id } = req.query

        try {

            var payment = await Payment.getPaymentByTrxId(trx_id);

            if (payment.payment_status == "PAID") {
                await Order.updatePaymentPaid(trx_id);
                Inbox.updateInboxPPOB(trx_id)
                var orders = await Order.getAllOrderSellerByPayment(trx_id);
                for (const index in orders) {
                    if (Object.hasOwnProperty.call(orders, index)) {
                        const order = orders[index];
                        const seller_id = order.seller_id;
                        Order.createHistory({
                            note: `Order already paid by system`,
                            name: "Order PAID",
                            user_id: "",
                            order_id: order.order_id
                        })
                        var fcm = await Fcm.fcmPPOB(seller_id)
                        if (fcm.length != 0) {
                            var token = fcm[0].token
                            utils.sendFCM(
                                `Pesanan Masuk`,
                                `Selamat ada pesanan masuk yuk segera di proses`,
                                'ORDER_RECEIVE',
                                token,
                                '-'
                            )
                        }

                    }
                }
            }
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    },

}