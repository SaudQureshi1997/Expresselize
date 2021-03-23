import User from "@models/user";
import jwt from "express-jwt";

export default [
  jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
  }),
  async (req, res, next) => {
    const userData = req.user.data;
    req.user = await User.findById(userData.id);
  
    next();
  },
  function (err, req, res, next) {
    res.status(401).json({ error: err.message });
  },
];
