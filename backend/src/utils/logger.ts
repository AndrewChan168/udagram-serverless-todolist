import * as winston from 'winston'

const format = winston.format.printf(({ level, message, timestamp }) => {
  return `${level} ${timestamp} - ${message}`
})

/**
 * Create a logger instance to write log messages in JSON format.
 *
 * @param loggerName - a name of a logger that will be added to all messages
 */
export function createLogger(loggerName: string) {
  return winston.createLogger({
    //level: 'info',
    //format: winston.format.json(),
    format: winston.format.combine(winston.format.timestamp(), format),
    defaultMeta: { name: loggerName },
    transports: [
      new winston.transports.Console()
    ]
  })
}

/**
 * 
 * const { createLogger, format, transports } = require('winston');
 * const { combine, timestamp, printf } = format;
 * 
 * const myFormat = printf(({ level, message, timestamp }) => {
 *  return `${level} ${timestamp} - ${message}`
 * })
 * 
 * const logger = createLogger({
 *  format: combine(timestamp(), myFormat),
 *  defaultMeta: { name: 'logger' },
 *  transports: [new transports.Console()]
 * });
 * 
 * logger.info('Information message')
 * logger.error('error message')
 */
