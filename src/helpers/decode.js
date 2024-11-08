const jwt_decode = require("jwt-decode");

module.exports = {

    decodeToken: (authHeader) => {
        const token = authHeader && authHeader.split(' ')[1]
        const decoded = jwt_decode(token)
    
        return decoded
    }

}