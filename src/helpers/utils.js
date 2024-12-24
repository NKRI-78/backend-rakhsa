const { 
  format: format, 
  createLogger: createLogger, 
  transports: transports 
} = require('winston')

const bcrypt = require("bcryptjs")
const axios = require('axios')
const moment = require("moment-timezone")

const { combine, timestamp, label, printf } = format

const customFormat = printf(({ level, message, label, _ }) => {
    return `${moment().format('YYYY-MM-DD HH:mm:ss')} [${label}] ${level.toUpperCase()}: ${message}`
})

var date = moment().format('YYYY-MM-DD')

var options = {
    file: {
        level: 'info',
        filename: `${process.cwd()}/src/logs/${date}.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5 MB
        maxFiles: 5,
        colorize: false,
    },  
}

module.exports = {

    pad(width, string, padding) {
        return (width <= string.length) ? string : this.pad(width, padding + string, padding)
    },

    escapeHtml(text) {
        return text.replace(/<[^>]*>?/gm, '')
    },

    countryCompareContinent(country) {
        var val = ""
        
        switch(country) {
            case "United States": 
                val = "Amerika Utara"
            break;
            case "Japan": 
                val = "Asia"
            break;
        }

        return val
    },  

    getInitials(string) {
        var names = string.split(' '),
            initials = names[0].substring(0, 1).toUpperCase()
        
        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase()
        }
        return initials
    },

    fday: (date) => {
        return moment(date).locale('id').format('dddd')
    },

    fdate: (date) => {
        return moment(date).locale('id').format('dddd, DD MMM YYYY')
    },

    formatYearAndMonth(date) {
        return moment(date).locale('id').format('YYYY/MM')
    },

    formatDate: (date) => {
        return moment(date).locale('id').format('YYYY/MM/DD')
    },

    formatDateWithSubtractDays: (date, d) => {
        return moment(date).subtract(d, 'days').locale('id').format('YYYY/MM/DD')
    },

    formatDateWithSos: (date) => {
        return moment(date).locale('id').format('yyyy-MM-DD')
    },

    formatDateWithSeconds: (date) => {
        return moment(date).locale('id').format('yyyy/MM/DD H:mm:ss')
    },

    formatDateByName: (date) => {
        return moment(date).locale('id').format('DD MMM YYYY')
    },
  
    convertRp: (val) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val) 
    },

    makeid: (val) => {
        var result           = ''
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        var charactersLength = characters.length
        for ( var i = 0; i < val; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
    },

    validateEmail: (email) => {
        return String(email)
        .toLowerCase()
        .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    },

    encryptPassword: async (password) => {
        const salt = await bcrypt.genSalt(10)
        var passwordHash = await bcrypt.hash(password, salt)
        return passwordHash
    },

    checkPasswordEncrypt: async(password, passwordOld) => {
        var isValid = await bcrypt.compare(password, passwordOld)
        return isValid
    },

    isDigit(val) {
        return String(+val).charAt(0) == val;
    },

    sendEmail: async (email, otp) => {
        await axios.post('https://api-email.inovatiftujuh8.com/api/v1/email', {
            to: email,
            app: "Raksha",
            subject: "Raksha",
            body: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2"><div style="margin:50px auto; width:70%; padding: 20px 0;"><p style="font-size:1.1em;">Hi,</p><p>Use the following OTP to complete your Sign Up procedures. OTP is valid for 2 minutes</p><h2 style="background: #00466a; margin: 0 auto; width: max-content; padding: 0 10px; color: #fff; border-radius: 4px;">`+ otp +`</h2><p style="font-size:0.9em;">Regards, <br/>Raksha</p><hr style="border:none;border-top:1px solid #eee" /></div></div>`,  
        })
    },

    generateId(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    sendFCM: async (title, body, token, type, newsId, eventId) => {
        await axios.post('https://api-fcm.inovatiftujuh8.com/api/v1/firebase/fcm', {
            token: token,
            title: title,
            body: body,
            inbox_id: newsId,
            inbox_type: type,
            news_id: newsId,
            event_id: eventId,
            broadcast_type: type
        })
    },
    
    getExcerpt(text, length) {
        if (text.length <= length) {
          return text;
        }
        
        return text.substring(0, length) + '...';
    },

    hasDatePassed(date) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); 
        const givenDate = new Date(date);
        givenDate.setHours(0, 0, 0, 0); 
    
        return givenDate < currentDate;
    },
    
    logger: () => { 
        return createLogger({
            format: combine(label({ label: '' }), timestamp(), customFormat),
            transports: [
                new transports.File(options.file),
            ],
        })
    },

    logInfo: (val) => {
        return createLogger({
            format: combine(label({ label: 'LOG' }), timestamp(), customFormat),
            transports: [
                new transports.File(options.file),
            ],
        }).info(JSON.stringify(val))
    },

    reverseString(str) {
        // Step 1. Use the split() method to return a new array
        var splitString = str.split("") // var splitString = "hello".split("");
        // ["h", "e", "l", "l", "o"]
    
        // Step 2. Use the reverse() method to reverse the new created array
        var reverseArray = splitString.reverse() // var reverseArray = ["h", "e", "l", "l", "o"].reverse();
        // ["o", "l", "l", "e", "h"]
    
        // Step 3. Use the join() method to join all elements of the array into a string
        var joinArray = reverseArray.join("") // var joinArray = ["o", "l", "l", "e", "h"].join("");
        // "olleh"
        
        //Step 4. Return the reversed string
        return joinArray // "olleh"
    }
}