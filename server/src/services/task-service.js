import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import {
  createTaskValidation,
  deleteTasktValidation,
  getTasktValidation,
  updateTaskValidation,
} from "../validation/task-validation.js";
import { validate } from "../validation/validation.js";
import { v4 as uuidv4 } from "uuid";

const create = async (user, request) => {
  const task = validate(createTaskValidation, request);
  const newTask = { ...task, userId: user.id, id: uuidv4() };

  const response = await prismaClient.task.create({
    data: newTask,
  });

  return response;
};

const get = async (user) => {
  user = validate(getTasktValidation, user.id);

  const response = await prismaClient.task.findMany({
    where: { userId: user.id },
  });

  if (response.length === 0) {
    throw new ResponseError(404, "Task not found");
  }

  return response;
};

const update = async (user, request) => {
  const task = validate(updateTaskValidation, request);

  const existedTask = await prismaClient.task.findFirst({
    where: { id: task.id, userId: user.id },
  });

  if (!existedTask) {
    throw new ResponseError(404, "Task not found");
  }

  const response = await prismaClient.task.update({
    where: { id: task.id, userId: user.id },
    data: task,
  });

  return response;
};

const remove = async (user, taskId) => {
  taskId = validate(deleteTasktValidation, taskId);

  const existedTask = await prismaClient.task.findFirst({
    where: { id: taskId, userId: user.id },
  });

  if (!existedTask) {
    throw new ResponseError(404, "Task not found");
  }

  const response = await prismaClient.task.delete({
    where: { id: taskId, userId: user.id },
  });

  return response;
};

export default { create, get, update, remove };
