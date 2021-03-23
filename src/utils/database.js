import { Sequelize } from "sequelize";

const logTo = process.env.QUERY_LOG;
let logMethod = null;

console.log(logTo);

switch (logTo) {
  case 'console':
    logMethod = (sql, queryObj) => console.log(sql);
    break;
  case 'logger':
    logMethod = (sql, queryObj) => {
      const logger = require("@utils/logger").default;
      logger.debug(sql);
    }
  default:
    break;
}

let connection = null;
const connectionOptions = {
  logging: logMethod,
  host: process.env.DB_HOST,
  dialect: process.env.DB_CONNECTION,
  pool: {
    max: 5,
    min: 1,
    idle: 10000,
  },
};

/**
 *
 * @returns {Sequelize}
 */
const init = () => {
  if (connection === null) {
    connection = new Sequelize(
      process.env.DB_DATABASE,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      connectionOptions
    );
  }

  return connection;
};

export default { init };
