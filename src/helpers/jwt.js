require("dotenv").config()
const misc = require("../helpers/response")
const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
  
    const header = req.header("Authorization")

    if(typeof header == "undefined")
        return misc.response(res, 401, true, "No token, authorization denied.")

    if(header.includes('Bearer')) {
        const token = header.split(' ')[1]
        
        if (!token) 
            return misc.response(res, 401, true, "No token, authorization denied.")
        
        try {
            jwt.verify(token, process.env.SECRET_KEY, (e, decoded) => {
                if(e) {
                    if(e.message === "jwt expired") {
                        misc.response(res, 401, true, "Token expired.")
                    } 
                    if(e.message === "invalid token") {
                        misc.response(res, 401, true, "Invalid token.")
                    }
                } else {
                    /*------------------------------------------------
                    -- request.user = decoded.user                  --
                    -- If you want specify getting request property --
                    --------------------------------------------------*/
                    req.decoded = decoded
                    next()
                }
            })
        } catch (e) {
            console.log(e)
            misc.response(res, 500, true, "Server error")
        }
    } else {
        return misc.response(res, 401, true, "No token, authorization denied.")
    }

}
