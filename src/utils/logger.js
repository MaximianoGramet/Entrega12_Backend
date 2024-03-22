import winston, { format } from "winston";
import config from "../config/config.js";

const customLevelsOptions = {
    levels: {
      fatal: 0,
      error: 1,
      warning: 2,
      info: 3,
      http: 4,
      debug: 5,
    },   
    customColors: {
        fatal: 'bold red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'white',
        debug: 'blue',
    }
}


const prodLogger  = winston.createLogger({
    levels: customLevelsOptions.levels,
    format:format.combine(
        format.colorize({colors:customLevelsOptions.customColors}),
        format.printf((info)=>`${info.level}: ${info.message}`)
    ),
    transports:[
        new winston.transports.Console({level:"info"}),
        new winston.transports.File({ filename: './errors.log', level:"info"})
    ]
})

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels, 
    transports: [
        new winston.transports.Console({ level: "http" ,
        format:format.combine(
            format.colorize({colors:customLevelsOptions.customColors}),
            format.printf((info)=>`${info.level}: ${info.message}`)
            ),
        }),
        new winston.transports.File({ filename: './errors.log', level: 'warning' })
    ]
})

let logger;

if (config.environment === "production") {
  logger = prodLogger
} else {
  logger = devLogger
}

export const addLogger = (req, res, next) => {
    if (config.environment === 'production') {
        req.logger = prodLogger;

        req.logger.fatal(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

    } else {
        req.logger = devLogger;

        req.logger.fatal(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.error(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.info(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
    }
    next()
}

export default logger