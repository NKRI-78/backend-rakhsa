module.exports = {
  
    response: (res, status, error, message, data) => {
        var resultPrint = {};
        resultPrint.status = status || 200
        resultPrint.error = error || false
        resultPrint.message = message || "Ok"
        if (data) {
            resultPrint.data = data
        }
        return res.status(resultPrint.status).json(resultPrint)
    },
    
    responsePagination: (res, status, error, message, pageDetail, data) => {
        var resultPrint = {}
        resultPrint.status = status || 200
        resultPrint.error = error || false
        resultPrint.message = message || "Ok"
        resultPrint.pageDetail = pageDetail || {}
        resultPrint.data = data || {}
        return res.status(resultPrint.status).json(resultPrint)
    }
  
  }
  