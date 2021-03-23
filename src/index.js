import "source-map-support/register";
import express from "express";
import logger from "@utils/logger.js";
import HttpException from "@exceptions/HttpException.js";
import ValidationException from "@exceptions/ValidationException.js";
import router from "@http/routes";
import database from "@utils/database.js";
import cors from "cors";
import { formatter } from "@utils/validator";

const app = express();

console.log(router.list());
app.use(cors());
app.use(express.json());
app.use(router.router);

app.use((err, req, res, next) => {
  const code = err instanceof HttpException ? err.code : 500;
  const error =
    err instanceof ValidationException
      ? formatter(err.errors)
      : { error: err.message };

  if (!err instanceof ValidationException) {
    logger.error({
      err,
      code,
      trace: err.stack,
    });
  }

  return res.status(code).json(error);
});

app.listen(process.env.PORT || 5000, "0.0.0.0", async () => {
  const connection = await database.init();
  await connection.authenticate();
  console.log("Connected to sequelize");
  console.log(`Started at: ${process.env.PORT || 5000}...`);
});
