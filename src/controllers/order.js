const { decodeToken } = require('../helpers/decode')

const misc = require('../helpers/response')
const Order = require('../models/Order')
const User = require('../models/User')
const Product = require('../models/Product')
const Inbox = require('../models/Inbox')
const Store = require('../models/Store')
const utils = require("../helpers/utils")
const Fcm = require("../models/Fcm")
const ShippingAddress = require('../models/ShippingAddress')
const { v4: uuidv4 } = require('uuid')
const Logs = require('../models/Logs')

module.exports = {

    getOrdersPending: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        try {
            const storeId = await User.getStoreId(userId);
            const orders = await Order.getOrdersPending(storeId);

            misc.response(res, 200, false, "", orders)
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },
    confirmOrder: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid
        const { order_id } = req.params;

        try {
            const { buyerId, shipping_address, shipping_address_detail, shipping_code, amount, total_quantity, total_weight, store_id, receiver_phone } = await Order.getOrderDetail(order_id)
            const shipping = shipping_address.split(", ");
            const olshop_dest = await ShippingAddress.getJNEDestinationTarifCode(shipping[1], shipping[4])
            const store = await Store.getStoreByStoreId(store_id);
            const user = await User.getUserFullnameAndPhone(buyerId);

            var order = {
                quantity: total_quantity,
                weight: total_weight / 1000,
                total_price: amount,
                shipping_code: shipping_code,
                receiver_phone: receiver_phone
            }

            var shipping_destination = {
                address: shipping_address_detail,
                province: shipping[0],
                city: shipping[1],
                district: shipping[2],
                subdistrict: shipping[3],
                zip_code: shipping[4],
                dest: olshop_dest
            }

            const shipping_tracking = await Order.createAirWayBill(order_id, store, shipping_destination, order, user);

            var data = {
                note: `Order approved by store, will be sending order to destination ${olshop_dest}`,
                name: "Order Approved",
                user_id: userId,
                order_id: order_id
            }

            await Order.confirmOrder(order_id, shipping_tracking);
            Order.updateOrderStock(order_id)
            Order.createHistory(data)

            /// send notif
            var fcm = await Fcm.fcmPPOB(buyerId)
            if (fcm.length != 0) {
                var token = fcm[0].token
                utils.sendFCM(
                    order_id, `Your order ${order_id} has approved by store`, "order_approved", token, '-', '-'
                )
            }
            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },
    cancelOrder: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid
        const { order_id } = req.params;
        const { reason } = req.body;
        try {
            const { amount, buyerId } = await Order.getOrderAmountAndBuyer(order_id)
            await Order.cancelOrder(order_id);
            var data = {
                note: reason,
                name: "Order canceled by store",
                user_id: userId,
                order_id: order_id
            }
            Order.createHistory(data)
            User.updateBalance(buyerId, amount)

            /// Send to inbox and notif fcm after done
            Inbox.createOrUpdate(uuidv4(), `Order Canceled`, '', `Your order ${order_id} has canceled by store`, '-', buyerId, 'order_canceled');

            var fcm = await Fcm.fcmPPOB(buyerId)
            if (fcm.length != 0) {
                var token = fcm[0].token
                utils.sendFCM(
                    order_id, `Your order ${order_id} has canceled by store`, "order_canceled", token, '-', '-'
                )
            }

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    getStoreOrdersByStatus: async (req, res) => {
        try {

            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid
            const { status } = req.query;

            const storeId = await User.getStoreId(userId);
            const orders = await Order.getStoreOrdersByStatus(storeId, status);

            misc.response(res, 200, false, "", orders)
        } catch (error) {
            console.log(error.message)
            misc.response(res, 400, false, error.message)
        }
    },

    /// this function only for seller and admin
    getAllOrdersByStatus: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid

            const isAdmin = await User.isAdmin(userId)

            const status = req.query.status;

            var search = req.query.search || ""
            var page = parseInt(req.query.page) || 1
            var limit = parseInt(req.query.limit) || 20
            var offset = (page - 1) * limit

            const orders = await Order.getAllOrdersByStatus(limit, offset, search, status, isAdmin, userId);

            var resultTotal = orders.length
            var prevPage = page === 1 ? 1 : page - 1
            var nextPage = page === limit ? 1 : page + 1

            var pageDetail = {
                total: resultTotal,
                per_page: limit,
                next_page: nextPage,
                prev_page: prevPage,
                current_page: page,
                next_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + nextPage)}`,
                prev_url: `${process.env.BASE_URL}${req.originalUrl.replace("page=" + page, "page=" + prevPage)}`,
                data: orders
            }

            // const storeId = await User.getStoreId(userId);
            // const orders = await Order.getStoreOrdersByStatus(storeId, status);

            misc.response(res, 200, false, "", pageDetail)
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },

    getOrderDetail: async (req, res) => {
        try {
            // const decoded = decodeToken(req.get("Authorization"))
            // const userId = decoded.uid
            const order_id = req.params.order_id;

            const [order, orderItems] = await Promise.all([Order.getOrderFullDetail(order_id), Order.getOrderItems(order_id)]);

            misc.response(res, 200, false, "", {
                order, orderItems
            })
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },

    getOrderPendingCount: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid
            const storeId = await User.getStoreId(userId);

            const count = await Order.getOrderPendingCount(storeId);

            misc.response(res, 200, false, "", {
                order_count: count
            })
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },

    getWaitingPayment: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid
            // const storeId = await User.getStoreId(userId);

            const data = await Order.getWaitingPayment(userId);

            misc.response(res, 200, false, "", data)
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },

    getWaitingPaymentCount: async (req, res) => {
        try {
            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid
            // const storeId = await User.getStoreId(userId);

            const count = await Order.getWaitingPaymentCount(userId);

            misc.response(res, 200, false, "", {
                count: count
            })
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },



    getPayment: async (req, res) => {
        try {
            // const decoded = decodeToken(req.get("Authorization"))
            // const userId = decoded.uid
            const payment_id = req.params.payment_id;

            const payment = await Order.getPayment(payment_id);

            misc.response(res, 200, false, "", payment)
        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },

    trackingOrder: async (req, res) => {
        try {
            const tracking = await Order.getJneTraceTracking(req.params.cnote);
            if (tracking.cnote != null) {
                misc.response(res, 200, false, "", tracking)
            } else {
                throw new Error("Not Found")
            }

        } catch (error) {
            misc.response(res, 400, false, error.message)
        }
    },
    finishOrder: async (req, res) => {
        try {
            const order = await Order.getOrderSellerAndAmount(req.params.order_id);
            Order.finishOrder(order.order_id);
            Order.createHistory({
                note: `Order finished by buyer`,
                name: "Order Finished",
                user_id: "",
                order_id: order.order_id
            })
            User.updateBalance(order.sellerId, order.amount)
            Logs.createLogger(order.sellerId, 'ORDER_INCOMING_BALANCE', 'SELLER RECEIVE BALANCE FROM ORDER FINISHED', `${order.amount}`)

            var fcm = await Fcm.fcmPPOB(order.sellerId)
            if (fcm.length != 0) {
                var token = fcm[0].token
                utils.sendFCM(
                    order.order_id, `Your order ${order.order_id} has finished`, "order_finished", token, '-', '-'
                )
            }

            misc.response(res, 200, false, "")
        } catch (error) {
            console.log(error.message);
            misc.response(res, 400, false, error.message)
        }
    },
    reviewsOrder: async (req, res) => {
        try {
            var reviews = req.body.reviews;
            const decoded = decodeToken(req.get("Authorization"))
            const userId = decoded.uid
            const orderId = req.params.order_id;

            reviewKeys = Object.keys(reviews)

            for (const index in reviewKeys) {
                if (Object.hasOwnProperty.call(reviewKeys, index)) {
                    const productId = reviewKeys[index];
                    var review = reviews[productId];
                    Product.addReview({
                        id: review.uid,
                        product_id: productId,
                        user_id: userId,
                        rating: review.rating,
                        caption: review.caption,
                    });

                    for (let index2 = 0; index2 < review.files.length; index2++) {
                        const path = review.files[index2];
                        Product.addReviewPicture(review.uid, path)
                    }

                }
            }

            await Order.reviewedAllProductOrder(orderId);

            misc.response(res, 200, false, "")
        } catch (error) {
            console.log(error.message);
            misc.response(res, 400, false, error.message)
        }
    }

}

