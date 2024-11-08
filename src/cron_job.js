const cron = require("cron")
const Order = require('./models/Order')
const User = require('./models/User')
const Logs = require('./models/Logs')
const moment = require('moment');
const utils = require("./helpers/utils")
const Fcm = require("./models/Fcm")

var CronJob = cron.CronJob;

/// */60 * * * * *
const trackingCron = new CronJob('0 */60 * * * *', async () => {
    // console.log("TEST CRON MENIT");
    // const orders = await Order.getOrdersForTracking();
    // console.log(orders)
    // for (const index in orders) {
        // if (Object.hasOwnProperty.call(orders, index)) {
        //     const order = orders[index];
        //     const tracking = await Order.getJneTraceTracking(order.shipping_tracking)

        //     const currentDate = moment.utc(new Date())
        //     const lastOrderUpdate = moment.utc(order.updated_at)
        //     const diff = lastOrderUpdate.diff(currentDate, 'days')

            /// if c_note not found check confirm order already expired
            // if (tracking.status == false && diff <= -1) {
            //     Order.cancelOrder(order.order_id)
            //     Order.createHistory({
            //         note: `Order canceled by system, order already expired, store not send c_note to deliver`,
            //         name: "Order canceled",
            //         user_id: "",
            //         order_id: order.order_id
            //     })
            //     User.updateBalance(order.buyerId, order.amount + order.shipping_amount)
            //     Logs.createLogger(order.buyerId, 'ORDER_RETUR_BALANCE', 'USER RECEIVE BALANCE FROM ORDER CANCELED', `${order.amount + order.shipping_amount}`)
            //     var fcm = await Fcm.fcmPPOB(order.buyerId)
            //     if (fcm.length != 0) {
            //         var token = fcm[0].token
            //         utils.sendFCM(
            //             order.order_id, `Your order ${order.order_id} has canceled by system because store not sending c_note to deliver`, "order_canceled", token
            //         )
            //     }
            // }

            /// update status if has cnote
            // if (tracking.cnote != null) {
            //     Order.confirmUpdateStatusOrder(order.order_id, tracking.cnote.pod_status)
            //     if (tracking.cnote.pod_status != order.status) {
            //         Order.createHistory({
            //             note: tracking.history[0].desc,
            //             name: `Order has update by delivery [${tracking.cnote.pod_status}]`,
            //             user_id: "",
            //             order_id: order.order_id
            //         })
            //     }
            // }
        // }
    // }
});

/// 0 0 * * *
const checkDeliveredDone = new CronJob('0 0 * * *', async () => {
    // const orders = await Order.getOrderDeliveredButNotFinish();
    // console.log(orders)
    // for (const index in orders) {
    //     if (Object.hasOwnProperty.call(orders, index)) {
    //         const order = orders[index];
    //         const currentDate = moment.utc(new Date())
    //         const lastOrderUpdate = moment.utc(order.updated_at)
    //         const diff = lastOrderUpdate.diff(currentDate, 'days')

    //         if (diff <= -1) {
    //             Order.finishOrder(order.order_id);
    //             Order.createHistory({
    //                 note: `Order finished by system`,
    //                 name: "Order Finished",
    //                 user_id: "",
    //                 order_id: order.order_id
    //             })
    //             User.updateBalance(order.sellerId, order.amount)
    //             Logs.createLogger(order.sellerId, 'ORDER_INCOMING_BALANCE', 'SELLER RECEIVE BALANCE FROM ORDER FINISHED', `${order.amount}`)

    //             var fcm = await Fcm.fcmPPOB(order.sellerId)
    //             if (fcm.length != 0) {
    //                 var token = fcm[0].token
    //                 utils.sendFCM(
    //                     order.order_id, `Your order ${order.order_id} has finished`, "order_finished", token
    //                 )
    //             }
    //         }
    //     }
    // }
});

/// 0 0 * * *
const checkOrderPaidButNotProccess = new CronJob('0 0 * * *', async () => {

    // const orders = await Order.getOrderPaidButNotProccess();

    // for (const index in orders) {
        // if (Object.hasOwnProperty.call(orders, index)) {
        //     const order = orders[index];

        //     const currentDate = moment.utc(new Date())
        //     const lastOrderUpdate = moment.utc(order.updated_at)
        //     const diff = lastOrderUpdate.diff(currentDate, 'days')


        //     if (diff <= -1) {
        //         Order.cancelOrder(order.order_id)
        //         Order.createHistory({
        //             note: `Order canceled by system, order already expired, store not proccess order`,
        //             name: "Order canceled",
        //             user_id: "",
        //             order_id: order.order_id
        //         })
        //         User.updateBalance(order.buyer_id, order.amount + order.shipping_amount)
        //         Logs.createLogger(order.buyer_id, 'ORDER_RETUR_BALANCE', 'USER RECEIVE BALANCE FROM ORDER CANCELED', `${order.amount + order.shipping_amount}`)
        //         var fcm = await Fcm.fcmPPOB(order.buyer_id)
        //         if (fcm.length != 0) {
        //             var token = fcm[0].token
        //             utils.sendFCM(
        //                 order.order_id, `Your order ${order.order_id} has canceled by system because store not process your order 1x24 hour`, "order_canceled", token
        //             )
        //         }
        //     }
        // }
    // }
});


checkDeliveredDone.start()
trackingCron.start()
checkOrderPaidButNotProccess.start()