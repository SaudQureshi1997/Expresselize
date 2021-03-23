import niv from "node-input-validator";
import database from "@utils/database";
import { QueryTypes } from "sequelize";
import ValidationException from "@exceptions/ValidationException";
import logger from "./logger";

niv.bailable(false);

const uniqueCallback = async ({ value, args }) => {
  const connection = database.init();
  let tableName = args[0];
  let columnName = args[1];
  const bindings = {
    value,
  };
  const query = `select id from ${tableName} where ${columnName} = :value`;
  if (args[2]) {
    bindings["id"] = args[2];
    query.concat(` and id != :id`);
  }
  const response = await connection.query(query, {
    type: QueryTypes.SELECT,
    replacements: bindings,
  });
  logger.info({query, response});

  return response.length === 0;
};

const existsCallback = async ({value, args}) => {
  const unique = await uniqueCallback({value, args});

  return !unique;
}

niv.extend("unique", uniqueCallback);
niv.extend("exists", existsCallback);

niv.extendMessages({
  unique: "The :attribute already exists in the database",
  exists: "The :attribute does not exist in the database",
});

const formatter = (errors) => {
  const formatted = {};
  Object.keys(errors).forEach((errorKey) => {
    formatted[errorKey] = errors[errorKey].map((error) => error.message);
  });
  return formatted;
};

/**
 *
 * @param {Object} body
 * @param {Object} rules
 */
const validator = async (body, rules) => {
  const v = new niv.Validator(body, rules);

  if (await v.fails()) {
    throw new ValidationException(v.errors);
  }

  return body;
};

export default validator;
export { formatter };
