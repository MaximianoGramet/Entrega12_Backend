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
    req.logger = logger;
    const logLevel = config.environment === 'production' ? 'http' : 'warning';
    req.logger.log(logLevel, `${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
   };

export default logger