const misc = require('../helpers/response')

const { v4: uuidv4 } = require('uuid')
const Cart = require('../models/Cart')
const Product = require('../models/Product')
const { decodeToken } = require('../helpers/decode')

module.exports = {

    createCart: async (req, res) => {
        const uid = uuidv4()

        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { product_id, quantity, note } = req.body

        try {
            const carts = await Cart.find(product_id, userId)

            if (carts.length != 0) {
                var cartId = carts[0].cart_id

                await Cart.update(cartId, quantity, note)
            } else {
                await Cart.create(uid, userId, product_id, quantity, note)
            }

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    getCartInfo: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        try {

            const carts = await Cart.info(userId)

            var totalPrice = 0

            const cartSelecteds = await Cart.cartSelected(userId)

            for (var i in cartSelecteds) {
                var cartSelected = cartSelecteds[i]

                totalPrice += cartSelected.price * cartSelected.quantity
            }

            var stores = []

            var qty = 0

            for (var i = 0; i < carts.length; i++) {

                var items = [];

                if (carts[i].product_name.includes(',')) {
                    for (var z in carts[i].product_name.split(',')) {
                        var pid = carts[i].product_id.split(',')[z]
                        var pname = carts[i].product_name.split(',')[z]
                        var pprice = carts[i].product_price.split(',')[z]
                        var pweight = carts[i].product_weight.split(',')[z]
                        var pstock = carts[i].product_stock.split(',')[z]
                        var pMinOrder = carts[i].product_min_order.split(',')[z]

                        var cCartId = carts[i].cart_id.split(',')[z]
                        var cSelected = carts[i].selected.split(',')[z]
                        var cQuantity = parseInt(carts[i].quantity.split(',')[z])
                        var cNote = carts[i].note.split(',')[z]

                        const pictures = await Product.getProductPictureByProductId(pid)

                        items.push({
                            cart: {
                                id: cCartId,
                                selected: cSelected == 1 ? true : false,
                                quantity: parseInt(cQuantity),
                                is_out_stock: pstock == cQuantity
                                    ? true
                                    : false,
                                note: cNote
                            },
                            id: pid,
                            name: pname,
                            picture: pictures[0].path,
                            price: parseInt(pprice),
                            weight: parseInt(pweight),
                            stock: parseInt(pstock),
                            min_order: parseInt(pMinOrder),
                        })
                    }

                } else {
                    var pid = carts[i].product_id
                    var pname = carts[i].product_name
                    var pprice = carts[i].product_price
                    var pweight = carts[i].product_weight
                    var pstock = carts[i].product_stock
                    var pMinOrder = carts[i].product_min_order

                    var cCartId = carts[i].cart_id
                    var cSelected = carts[i].selected
                    var cQuantity = parseInt(carts[i].quantity)
                    var cNote = carts[i].note

                    const pictures = await Product.getProductPictureByProductId(pid)

                    items.push({
                        cart: {
                            id: cCartId,
                            selected: cSelected == 1 ? true : false,
                            quantity: cQuantity,
                            note: cNote,
                            is_out_stock: pstock == cQuantity
                                ? true
                                : false,
                        },
                        id: pid,
                        name: pname,
                        picture: pictures.length == 0
                            ? '-'
                            : pictures[0].path,
                        price: parseInt(pprice),
                        weight: parseInt(pweight),
                        stock: parseInt(pstock),
                        min_order: parseInt(pMinOrder),
                    })
                }

                items.forEach(function (item) {
                    qty += item.cart.quantity
                })

                stores.push({
                    selected: items.some((e) => e.cart.selected == true),
                    store: {
                        id: carts[i].store_id,
                        name: carts[i].store_name,
                        picture: carts[i].store_picture,
                        description: carts[i].store_description,
                        address: carts[i].store_address,
                    },
                    items
                })
            }

            misc.response(res, 200, false, "", {
                total_item: qty,
                total_price: totalPrice,
                stores: stores
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    updateQuantityCart: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { cart_id, quantity } = req.body

        try {

            await Cart.updateQuantityCart(cart_id, userId, quantity)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    updateNoteCart: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { cart_id, note } = req.body

        try {

            await Cart.updateNote(cart_id, userId, note)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    updateNoteBuyLive: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { cart_id, note } = req.body

        try {

            await Cart.updateNoteBuyLive(cart_id, userId, note)

            misc.response(res, 200, false, "")
        } catch (e) {
            console.log(e)
            misc.response(res, 400, false, e.message)
        }
    },

    updateCartSelected: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { cart_id } = req.params
        const { selected, type } = req.body

        try {

            if (type == "all") {
                var s = selected == true ? '1' : '0'
                await Cart.updateCartAll(s, userId)
            } else {
                var s = selected == true ? '1' : '0'
                await Cart.updateCartSelected(s, cart_id, userId)
            }

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, false, e.message)
        }
    },

    deleteCart: async (req, res) => {
        const decoded = decodeToken(req.get("Authorization"))
        const userId = decoded.uid

        const { cart_id } = req.body

        try {

            await Cart.delete(cart_id, userId)

            misc.response(res, 200, false, "")
        } catch (e) {
            misc.response(res, 400, true, e.message)
        }
    }

}