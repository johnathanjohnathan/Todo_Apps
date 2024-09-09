import { prismaClient } from "../src/application/database.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const removeTestUser = async () => {
  await prismaClient.user.deleteMany({
    where: {
      username: "test",
    },
  });
};

export const createTestUser = async () => {
  const user = await prismaClient.user.create({
    data: {
      username: "test",
      email: "test@example.com",
      password: await bcrypt.hash("rahasia", 10),
    },
  });
  return user.id;
};

export const removeAllTestTask = async (taskId) => {
  await prismaClient.task.deleteMany({
    where: {
      id: taskId,
    },
  });
};

export const createToken = () => {
  const token = jwt.sign(
    { username: "test", email: "test@example.com" },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

export const createTask = async (userId) => {
  return prismaClient.task.create({
    data: {
      title: "Test Task",
      description: "This is a test task",
      userId: userId,
    },
  });
};
