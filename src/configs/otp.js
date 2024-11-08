const otpGenerator = require('otp-generator')
module.exports.generateOTP = () => {
    const OTP = otpGenerator.generate(4, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    })
    return OTP
}