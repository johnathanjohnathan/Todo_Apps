import Joi from "joi";

const createTaskValidation = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(100).optional(),
  dueDate: Joi.date().optional(),
  progress: Joi.number().min(1).max(100).optional(),
  status: Joi.boolean().optional(),
});

const getTasktValidation = Joi.string().guid({ version: "uuidv4" }).required();

const updateTaskValidation = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().min(1).max(100).optional(),
  dueDate: Joi.date().optional(),
  progress: Joi.number().min(0).max(100).optional(),
  status: Joi.boolean().optional(),
  id: Joi.string().guid({ version: "uuidv4" }).required(),
  userId: Joi.string().guid({ version: "uuidv4" }).required(),
});

const deleteTasktValidation = Joi.string()
  .guid({ version: "uuidv4" })
  .required();

export {
  createTaskValidation,
  getTasktValidation,
  updateTaskValidation,
  deleteTasktValidation,
};
