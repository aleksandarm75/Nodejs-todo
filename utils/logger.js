const winston = require('winston');
const { createLogger, format } = require('winston');

const logConfiguration = {
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/todolog.log'
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: 'APP'
        }),
        winston.format.simple(),
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss:SSS'
        }),
        winston.format.printf(info => {
            if (globalSessionID === "") {
                let out = `[${info.label}][${info.level}][${[info.timestamp]}] ${info.message}`;
                return out;
            }
            else {
                let out = `[${info.label}][${info.level}][ReqId:${globalSessionID}][${[info.timestamp]}] ${info.message}`;
                return out;
            }
        })
    )
};

module.exports = createLogger(logConfiguration);
