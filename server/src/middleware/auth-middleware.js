import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }

  try {
    const tokenValue = token.startsWith("Bearer ") ? token.slice(7) : token;

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET_KEY);

    const user = await prismaClient.user.findFirst({
      where: {
        username: decoded.username,
      },
    });

    if (!user) {
      return res.status(401).json({ errors: "Unauthorized" }).end();
    }

    req.user = user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ errors: "Unauthorized", message: err.message })
      .end();
  }
};
