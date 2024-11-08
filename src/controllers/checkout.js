const qs = require("qs")
const moment = require('moment');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid')
const { decodeToken } = require('../helpers/decode')
const misc = require('../helpers/response')
const Checkout = require('../models/Checkout')
const Product = require('../models/Product');
const User = require('../models/User')
const { checkout } = require("../routes/checkout");
const Inbox = require("../models/Inbox")
const utils = require("../helpers/utils")
const Fcm = require("../models/Fcm")

module.exports = {

    addProductShoppingLive: async (req, res) => {
        const uid = uuidv4();

        const decoded = decodeToken(req.get("Authorization"));
        const userId = decoded.uid;

        const { product_id, quantity, note } = req.body;

        try {
            var data = {
                uid: uid,
                userId: userId,
                product_id: product_id,
                quantity: quantity,
                note: note,

            }
            await Checkout.addProductShoppingLive(data);

            misc.response(res, 200, true, "");
        } catch (e) {
            misc.response(res, 400, true, e.message);
        }
    },

    getProductShoppingLive: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"));
        const userId = decoded.uid;

        try {

            const products = await Checkout.getProductsGroupConcat(userId);

            var totalItem = 0;
            var totalPrice = 0;

            const shoppingLives = await Checkout.getQtyPriceShoppingLive(userId);

            for (var i in shoppingLives) {
                var shoppingLive = shoppingLives[i];

                totalItem += 1;
                totalPrice += shoppingLive.price * shoppingLive.quantity;
            }

            var stores = [];

            for (var i = 0; i < products.length; i++) {

                var id = products[i].product_id;
                var name = products[i].product_name;
                var price = products[i].product_price;
                var weight = products[i].product_weight;
                var stock = products[i].product_stock;
                var minOrder = products[i].product_min_order;

                var cartId = products[i].cart_id;
                var quantity = parseInt(products[i].quantity);
                var note = products[i].note;


                const pictures = await Product.getProductPictureByProductId(id)

                var items = [];

                items.push({
                    cart: {
                        id: cartId,
                        selected: true,
                        quantity: quantity,
                        note: note,
                        is_out_stock: false,
                    },
                    name: name,
                    id: id,
                    picture: pictures[0].path,
                    price: parseInt(price),
                    weight: parseInt(weight),
                    stock: parseInt(stock),
                    min_order: parseInt(minOrder),
                })

                stores.push({
                    selected: true,
                    store: {
                        id: products[i].store_id,
                        name: products[i].store_name,
                        picture: products[i].store_picture,
                        description: products[i].store_description,
                        address: products[i].store_address,
                    },
                    items
                });
            }

            misc.response(res, 200, false, "", {
                total_item: totalItem,
                total_price: totalPrice,
                stores: stores
            });
        } catch (e) {
            misc.response(res, 400, true, e.message);
        }
    },

    addCourierProduct: async (req, res) => {
        const uid = uuidv4();
        const decoded = decodeToken(req.get("Authorization"));
        const userId = decoded.uid;

        const {
            courier_code,
            courier_service,
            courier_name,
            courier_description,
            cost_value,
            cost_note,
            cost_etd,
            store_id
        } = req.body;

        try {

            var data = {
                uid: uid,
                userId: userId,
                store_id: store_id,
                courier_code: courier_code,
                courier_service: courier_service,
                courier_name: courier_name,
                courier_description: courier_description,
                cost_value: cost_value,
                cost_note: cost_note,
                cost_etd: cost_etd,
            }

            await Checkout.addCourierProduct(data);

            misc.response(res, 200, false, "");
        } catch (e) {
            misc.response(res, 400, true, e);
        }
    },

    courierCostList: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"));
        const userId = decoded.uid;

        const { store_id, buy_from } = req.body;

        var type = buy_from || "cart";

        try {

            const selectDistrict = await Checkout.selectDistrict(store_id);

            const originSubdistrictId = await Checkout.getSubdistrictId(selectDistrict[0].district);

            const shippingAddress = await Checkout.getShippingAddressByUser(userId);

            if (!shippingAddress)
                throw new Error('Please select shipping address')

            const destinationSubdistrictId = await Checkout.getSubdistrictId(shippingAddress.district);

            var products = [];

            if (type == "cart") {
                const carts = await Checkout.productCart(userId);

                products = carts;
            } else {
                const carts = await Checkout.productLive(userId);

                products = carts;
            }

            var weight = 0;

            if (!products)
                throw new Error('Product not found');

            for (var i in products) {
                var product = products[i];

                if (product.type == 'hewan') {
                    weight += product.weight * product.quantity * 2;
                } else {
                    weight += product.weight * product.quantity;
                }
            }

            const url = `${process.env.API_RAJA_ONGKIR}/api/cost`;

            const data = qs.stringify({
                origin: originSubdistrictId,
                originType: "subdistrict",
                destination: destinationSubdistrictId,
                destinationType: "subdistrict",
                weight: weight,
                courier: "jne",
            });

            var config = {
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'key': process.env.RAJA_ONGKIR_KEY,
                },
                data: data
            };

            const result = await axios(config)

            var RajaOngkirData = []

            for (var i in result.data.rajaongkir.results) {
                var rajaongkir = result.data.rajaongkir.results[i]
                var costs = result.data.rajaongkir.results[i].costs;

                var costsData = []
                for (var z in costs) {
                    // console.log(costs[z]);

                    // ini gak ngerti ngitung apa gak ada penjelasan
                    var value = ((costs[z].cost[0].value / 100) * 150) + costs[z].cost[0].value;

                    for (var i in products) {
                        var product = products[i];

                        if (product.type == 'hewan' || product.type == 'tumbuhan') {
                            weight += ((costs[z].cost[0].value / 100) * 150) + costs[z].cost[0].value;
                        } else {
                            weight += costs[z].cost[0].value;
                        }
                    }

                    costsData.push({
                        service: costs[z].service,
                        description: costs[z].description,
                        cost: [
                            {
                                value: costs[z].cost[0].value, // pake default harga raja ongkir
                                etd: costs[z].cost[0].etd,
                                note: costs[z].cost[0].note
                            }
                        ]
                    });
                }

                RajaOngkirData.push({
                    code: rajaongkir.code,
                    name: rajaongkir.name,
                    costs: costsData
                })
            }

            misc.response(res, 200, false, "", {
                origin: result.data.rajaongkir.origin_details,
                destination: result.data.rajaongkir.destination_details,
                data: RajaOngkirData
            });

        } catch (e) {
            console.log(e);
            misc.response(res, 400, true, e.message);
        }
    },

    checkoutOrder: async (req, res) => {
        // const decoded = decodeToken(req.get("Authorization"));
        // const userId = decoded.uid;

        // const { buy_from, shipment, payment_method } = req.body;

        // var type = buy_from || "cart";

        try {
        //     const shipments = Object.keys(shipment);
        //     var products;
        //     var orders = {};
        //     var orderItems = [];
        //     var totalShipping = 0;
        //     var totalAmount = 0;

        //     var profile = await User.self(userId)

        //     const date = moment().format('YYYYMMDD');
        //     var payment_id = 'BIL-' + date + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);

            /// user get address
            // var address = await Checkout.getShippingAddressByUser(userId);

            // var address_data = `${address.province}, ${address.city}, ${address.district}, ${address.subdistrict}, ${address.postal_code}`;
            // var address_detail = `${address.label}, ${address.name}, ${address.address}`;

            /// Get Product First
            // if (type == "cart") {
            //     products = await Checkout.getCheckoutProductCart({
            //         shipments: shipments,
            //         userId: userId,
            //     });
            // } else {
            //     products = await Checkout.getCheckoutProductLive({
            //         shipments: shipments,
            //         userId: userId,
            //     });
            // }

            // for (const index in products) {
            //     if (Object.hasOwnProperty.call(products, index)) {
            //         const product = products[index];
            //         const store_id = product.store_id;
            //         var storeAmount = orders[store_id]?.amount ?? 0;
            //         orders[store_id] = {
            //             "order_id": orders[store_id]?.order_id ?? 'INV-' + date + '-' + (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000),
            //             "payment_id": payment_id,
            //             "store_id": store_id,
            //             "amount": storeAmount += (parseInt(product.price) * parseInt(product.quantity)),
            //             "shipping_amount": shipment[store_id].cost[0].value,
            //             "shipping_code": shipment[store_id].service,
            //             "shipping_name": "JNE",
            //             "shipping_address": address_data,
            //             "shipping_address_detail": address_detail,
            //             "receiver_phone": address.phone_number
            //         }
            //         orderItems.push({
            //             "order_id": orders[store_id].order_id,
            //             "product_id": product.product_id,
            //             "qty": parseInt(product.quantity),
            //             "price": parseInt(product.price),
            //             "weight": parseInt(product.weight),
            //             "note": product.note,
            //         });
                    /// get total amount
            //         totalAmount += (parseInt(product.price) * parseInt(product.quantity));
            //     }
            // }

            /// get total shipping amount
            // totalShipping = Object.values(orders).map((o) => o.shipping_amount).reduce((a, b) => a + b, 0)

            /// make payment
            // const re = await axios({
            //     method: 'POST',
            //     url: `${process.env.API_PAYMENT_GATEWAY}/payment_v2/api/v1/pay/direct`,
            //     data: {
            //         channel: payment_method.payment_code,
            //         total_amount: totalAmount + totalShipping,
            //         billing_id: payment_id,
            //         billing_uid: userId,
            //         billing_phone: profile[0].phone ?? "",
            //         billing_email: profile[0].email ?? "",
            //         billing_name: profile[0].fullname ?? "",
            //         billing_address: "",
            //         trx_id: payment_id,
            //         invoice_value: payment_id,
            //         trx_desc: "Ecommerce HP3KI",
            //         success_url: "",
            //         callback_url: process.env.CALLBACK_ECOMMERCE,
            //         description: "Ecommerce HP3KI",
            //         merchant: "HP3KI",
            //         app_name: "HP3KI",
            //         remark: "Ecommerce  HP3KI",
            //         item: []
            //     }
            // });

            // var noVa = re.data.body.payment_code
            // var paymentGuide = re.data.body.payment_guide
            // var paymentGuideUrl = re.data.body.payment_guide_url

            // var payments = {
            //     payment_id: payment_id,
            //     user_id: userId,
            //     payment_method: payment_method.payment_method,
            //     payment_name: payment_method.payment_name,
            //     payment_code: payment_method.payment_code,
            //     payment_fee: payment_method.total_admin_fee,
            //     amount: totalAmount + totalShipping,
            //     status: "WAITING_FOR_PAYMENT",
            //     payment_url: re.data.body.invoice_url,
            //     payment_guide_url: paymentGuideUrl,
            //     payment_guide: paymentGuide,
            //     payment_no_va: noVa
            // };

            // Checkout.createOrders(Object.values(orders).map(val => Object.values(val)));
            // Checkout.createOrderItems(orderItems.map(val => Object.values(val)))
            // Checkout.createPayment(payments);

            // if (type == 'cart') {
                /// delete user cart 
            //     Checkout.deleteCartUser(userId)
            // }

            /// Send to inbox and notif fcm after done
            // var fcm = await Fcm.fcmPPOB(userId)

            // if (fcm.length != 0) {
            //     var token = fcm[0].token
            //     utils.sendFCM(
            //         `Silahkan Anda melakukan pembayaran sebesar ${utils.convertRp(payments.amount + payments.payment_fee)}`,
            //         payment_id, "payment", token, '-', '-', '-'
            //     )
            // }
            // Inbox.createInboxPPOB(
            //     `Silahkan Anda melakukan pembayaran sebesar ${utils.convertRp(payments.amount + payments.payment_fee)}`,
            //     paymentGuide, noVa, "UNPAID", payment_id, paymentGuideUrl, userId, "hp3ki"
            // )

            misc.response(res, 200, false, "", {});

        } catch (e) {
            misc.response(res, 400, true, e.response.data.message != null ? e.response.data.message : e.message);
        }
    },
}
