const escapeQuotes = require('escape-quotes')
const conn = require('../configs/db')

module.exports = {

    assignProduct: (data) => {

        var query = `INSERT INTO products (store_id, category_id, product_id, name, price, weight, description, stock, condition_id, min_order, status) 
        VALUES ('${data.store_id}', '${data.category_id}', '${data.uid}', '${data.name}', '${data.price}', '${data.weight}', '${escapeQuotes(data.description)}', '${data.stock}', '${data.condition}', '${data.min_order}', '${data.open}')
        ON DUPLICATE KEY UPDATE 
        name = '${data.name}',  price = '${data.price}', 
        category_id = '${data.category_id}',
        weight = '${data.weight}', description = '${escapeQuotes(data.description)}',
        stock = '${data.stock}', condition_id = '${data.condition}', min_order = '${data.min_order}', status = '${data.open}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getStoreId: (userId) => {
        var query = `
            SELECT store_id from stores where owner = '${userId}'
        `

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length != 0) {
                        resolve(result[0].store_id)
                    } else {
                        reject(new Error("Not Found"))
                    }

                }
            })
        })
    },

    productCategories: () => {
        var query = `SELECT category_id, name, type, picture, status FROM product_categories`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    assignCategory: (data) => {
        var query = `INSERT INTO product_categories (category_id, name, picture, status, type) 
        VALUES (
            '${data.uid}', 
            '${data.name}', 
            '${data.path}', 
            '${data.status}', 
            '${data.type}'
        )
        ON DUPLICATE KEY UPDATE 
            name = '${data.name}', 
            picture = '${data.path}',
            status = '${data.status}', 
            type = '${data.type}'
       `

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    uploadMedia: (productId, path) => {
        var query = `INSERT INTO product_pictures (product_id, path) VALUES ('${productId}', '${path}')`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    uploadMediaBulk: (productId, paths) => {

        var values = paths.map(function (path) {
            return [
                productId,
                path
            ];
        });

        var query = `INSERT INTO product_pictures (product_id, path) VALUES ?`

        return new Promise((resolve, reject) => {
            conn.query(query, [values], (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteMedia: (productId, path) => {
        var query = `DELETE FROM product_pictures WHERE path = '${path}' AND product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteMediaBulk: (productId, paths) => {
        var query = `DELETE FROM product_pictures WHERE path IN (${conn.escape(paths)}) AND product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    deleteMediaAll: (productId) => {
        var query = `DELETE FROM product_pictures WHERE product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getAllProduct: (data) => {
        var query = `SELECT p.product_id AS id, p.name, 
        CAST(p.price AS INT) price, 
        CAST(p.weight AS INT) weight, GROUP_CONCAT(pp.path, '') AS picture, p.description, 
        CAST(p.stock AS INT) stock, pc.name AS condition_name, 
        CAST(p.min_order AS INT) min_order,
        pcc.category_id AS category_id, 
        pcc.name AS category_name, 
        pcc.type AS category_type,
        s.store_id, 
        s.name AS store_name, 
        s.picture AS store_picture,
        s.description AS store_description,
        s.province AS store_province, 
        s.city AS store_city, 
        s.subdistrict AS store_subdistrict
        FROM products p 
        INNER JOIN product_conditions pc ON p.condition_id = pc.uid 
        INNER JOIN stores s ON p.store_id = s.store_id
        INNER JOIN product_categories pcc ON pcc.category_id = p.category_id
        LEFT JOIN profiles ps ON ps.user_id = s.owner
        LEFT JOIN product_pictures pp ON p.product_id = pp.product_id
        WHERE p.name LIKE '${data.search}%' AND s.open = 1 AND p.status = 1
        AND ps.member_type = 2
        AND pcc.type LIKE '%${data.category}%' 
        GROUP BY p.product_id, p.name, p.description 
        LIMIT ${data.offset}, ${data.limit}`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductReview: (productId) => {
        var query = `SELECT pr.product_id, avg(pr.rating) AS averagerate, COUNT(pr.user_id) AS total 
        FROM product_reviews pr WHERE pr.product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductCondition: () => {
        var query = `SELECT uid, name FROM product_conditions`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductInfo: (productId) => {
        var query = `SELECT s.owner, p.product_id AS id, p.name, 
        CAST(p.price AS INT) price, 
        CAST(p.weight AS INT) weight, GROUP_CONCAT(pp.path, '') AS picture, 
        p.description, 
        p.status,
        CAST(p.stock AS INT) stock, pc.name AS condition_name, pc.uid AS condition_id,
        CAST(p.min_order AS INT) min_order,
        pcc.category_id AS category_id, pcc.name AS category_name, pcc.type AS category_type,
        s.store_id, s.name AS store_name, s.picture AS store_picture, s.description AS store_description, s.city as store_city
        FROM products p 
        INNER JOIN product_conditions pc ON p.condition_id = pc.uid 
        INNER JOIN stores s ON p.store_id = s.store_id
        INNER JOIN product_categories pcc ON pcc.category_id = p.category_id
        LEFT JOIN product_pictures pp ON p.product_id = pp.product_id
        WHERE p.product_id = '${productId}'
        GROUP BY s.id`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getCartProductId: (productId) => {
        var query = `SELECT quantity FROM shopping_carts WHERE product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductReview: (productId) => {
        var query = `SELECT pr.product_id, avg(pr.rating) AS averagerate, COUNT(pr.user_id) AS total FROM product_reviews pr WHERE pr.product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    productDeletePicture: (productId) => {
        var query = `DELETE FROM product_pictures WHERE product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    productDelete: (productId) => {
        var query = `DELETE FROM products WHERE product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    categoryDelete: (categoryId) => {
        var query = `DELETE FROM product_categories WHERE category_id = '${categoryId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },
    detailCategory: (categoryId) => {
        var query = `Select * FROM product_categories WHERE category_id = '${categoryId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    if (result.length == 0) {
                        reject(new Error("Not Found"))
                    }
                    resolve(result[0])
                }
            })
        })
    },

    getAllProductSeller: (data) => {
        var query = `SELECT 
        p.product_id, p.name,
        CAST(p.price AS INT) price, stock, p.status
        FROM products p 
        INNER JOIN stores s ON s.store_id = p.store_id
        WHERE s.owner = '${data.user_id}' 
        AND p.name LIKE '%${data.search}%' 
        AND p.category_id LIKE '%${data.categoryId}%'
        GROUP BY p.id, p.product_id
        LIMIT ${data.offset}, ${data.limit}`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    listReview: () => {
        var query = `SELECT pr.uid, p.name, p.profile_pic, pr.caption, pr.rating
        FROM product_reviews pr 
        INNER JOIN profiles p ON p.user_id = pr.user_id`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    detailReview: (productId) => {
        var query = `SELECT pr.uid, pf.fullname, pf.avatar, pr.caption, pr.rating, pr.created_at
        FROM product_reviews pr 
        INNER JOIN profiles pf ON pf.user_id = pr.user_id 
        INNER JOIN products p ON pr.product_id = p.product_id
        WHERE p.product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    addReviewPicture: (id, path) => {
        var query = `INSERT INTO product_review_pictures (review_id, path) VALUES ('${id}', '${path}')`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    addReview: (data) => {
        var query = `INSERT INTO product_reviews (uid, product_id, user_id, rating, caption)
        VALUES ('${data.id}', '${data.product_id}', '${data.user_id}', '${data.rating}', '${data.caption}')`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductByTransactionId: (transactionId) => {
        var query = `SELECT 
        p.product_id AS productId,
        p.name AS productName, 
        p.price AS productPrice,
        toi.weight AS productWeight,
        toi.note AS productNote,
        toi.quantity AS productQty
        FROM products p
        INNER JOIN transaction_order_items toi ON toi.product_id = p.product_id
        WHERE toi.transaction_id = '${transactionId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductPictureByProductId: (productId) => {
        var query = `SELECT path FROM product_pictures WHERE product_id = '${productId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

    getProductPictureReviewByReviewId: (reviewId) => {
        var query = `SELECT path FROM product_review_pictures WHERE review_id = '${reviewId}'`

        return new Promise((resolve, reject) => {
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}