import ValidationException from "@exceptions/ValidationException";
import User from "@models/user";
import Validator from "@utils/validator";
import bcrypt from "bcrypt";
import createToken from "@utils/token-creator";

export const register = async ({ req, res }) => {
  const data = await Validator(req.body, {
    email: "required|email|unique:users,email",
    password: "required|string|minLength:8",
    name: "required|string",
  });

  const user = await User.register(data);
  const token = createToken(user.tokenPayload());

  return res.json({
    token,
  });
};

export const login = async ({ req, res }) => {
  const data = await Validator(req.body, {
    email: "required|email|exists:users,email",
    password: "required|string|minLength:8"
  });

  const user = await User.findOne({ email: data.email });
  const check = bcrypt.compareSync(data.password, user.password);

  if (!check) {
    throw new ValidationException({password: ['password does not match.']});
  }

  const token = createToken(user.tokenPayload());

  return res.json({ token });
};

export const me = ({ req, res }) => {
  return res.json(req.user);
};
