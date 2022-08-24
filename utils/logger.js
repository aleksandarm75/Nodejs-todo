const winston = require('winston');
const { createLogger, format, transports } = require('winston');

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: 'logs/todolog.log'
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: '👉'
        }),
        winston.format.simple(),
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${info.label} ${[info.timestamp]}: ${info.message}`),
    )
};

module.exports = createLogger(logConfiguration);