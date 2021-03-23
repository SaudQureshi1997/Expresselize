import jwt from "jsonwebtoken";

export default (data) => {
  return jwt.sign({ data }, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: "24h",
  });
};
