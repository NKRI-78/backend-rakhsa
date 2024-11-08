import moment from "moment"

import { format, createLogger, transports } from "winston"

const { combine, timestamp, label, printf } = format

const customFormat = printf(({ level, message, label, _ }) => {
    return `${moment().format('YYYY-MM-DD HH:mm:ss')} [${label}] ${level.toUpperCase()}: ${message}`
})

var date = moment().format('YYYY-MM-DD')

var options = {
    file: {
        level: 'info',
        filename: `logs/${date}.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5 MB
        maxFiles: 5,
        colorize: false,
    },
}

export const logger = createLogger({
    format: combine(label({ label: 'LOGGER' }), timestamp(), customFormat),
    transports: [
        new transports.File(options.file),
    ],
})
