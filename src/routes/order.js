const express = require("express")
const Route = express.Router()
const order = require("../controllers/order")
const jwt = require("../helpers/jwt")

/// /me/ is seller not buyer

Route
    .get("/pending", jwt, order.getOrdersPending)
    .get("/me", jwt, order.getStoreOrdersByStatus)
    .get("/me/pending/count", jwt, order.getOrderPendingCount)
    .get("/waiting-payment/count", jwt, order.getWaitingPaymentCount)
    .get("/waiting-payment", jwt, order.getWaitingPayment)
    .get("/all", jwt, order.getAllOrdersByStatus)
    .get("/:order_id/detail", jwt, order.getOrderDetail)
    .get("/:payment_id/payment", jwt, order.getPayment)
    .post("/:order_id/cancel", jwt, order.cancelOrder)
    .post("/:order_id/confirm", jwt, order.confirmOrder)
    .get("/:cnote/tracking", jwt, order.trackingOrder)
    .post("/:order_id/finish", jwt, order.finishOrder)
    .post("/:order_id/reviews", jwt, order.reviewsOrder)

module.exports = Route