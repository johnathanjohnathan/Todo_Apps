import { validate } from "../validation/validation.js";
import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      username: user.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exists");
  }

  user.password = await bcrypt.hash(user.password, 10);

  const newUser = { ...user, id: uuidv4() };

  const result = await prismaClient.user.create({
    data: newUser,
    select: {
      username: true,
      email: true,
      id: true,
    },
  });

  return result;
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: loginRequest.username,
    },
  });

  if (!user) {
    throw new ResponseError(401, "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new ResponseError(401, "Invalid credentials");
  }

  const token = jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

export default { register, login };
