import HttpException from "@exceptions/HttpException";
import authMiddleware from './auth';

export default [
  authMiddleware,
  (req, res, next) => {
    const data = req.user.data;
    if (data.type !== "admin") {
      throw new HttpException("Unauthorised", 401);
    }
    next();
  },
];
