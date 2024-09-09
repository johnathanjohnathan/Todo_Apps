import supertest from "supertest";
import { web } from "../src/application/web.js";
import { logger } from "../src/application/logging.js";
import {
  createTask,
  createTestUser,
  createToken,
  removeAllTestTask,
  removeTestUser,
} from "./test-util.js";
import bcrypt from "bcrypt";

describe("POST /api/tasks", function () {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeAllTestTask();
    await removeTestUser();
  });

  it("should create a new task", async () => {
    const token = createToken();
    const result = await supertest(web)
      .post("/api/tasks")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "Test Task",
        description: "This is a test task",
      });

    expect(result.status).toBe(200);
    expect(result.body.data.id).toBeDefined();
    expect(result.body.data.title).toBe("Test Task");
    expect(result.body.data.description).toBe("This is a test task");
  });

  it("should reject to create a new task if data invalid", async () => {
    const token = createToken();
    const result = await supertest(web)
      .post("/api/tasks")
      .set("Authorization", "Bearer " + token)
      .send({
        title: "",
        description: "",
      });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("GET /api/tasks", function () {
  let token;
  let taskId;
  let userId;
  let task;

  beforeEach(async () => {
    userId = await createTestUser();
    token = createToken();
    task = await createTask(userId);
    taskId = task.id;
  });

  afterEach(async () => {
    await removeAllTestTask(taskId);
    await removeTestUser();
  });

  it("should retrieve an existing task", async () => {
    const result = await supertest(web)
      .get(`/api/tasks`)
      .set("Authorization", "Bearer " + token);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data[0].title).toBe("Test Task");
    expect(result.body.data[0].description).toBe("This is a test task");
  });

  it("should return 401 for a unauthorized request", async () => {
    const result = await supertest(web).get(`/api/tasks}`);

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

describe("PUT /api/tasks/:taskId", () => {
  let token;
  let taskId;
  let userId;

  beforeEach(async () => {
    userId = await createTestUser();
    token = createToken();
    const task = await createTask(userId);
    taskId = task.id;
  });

  afterEach(async () => {
    await removeAllTestTask(taskId);
    await removeTestUser();
  });

  it("should update an existing task", async () => {
    const updatedData = {
      title: "Updated Task Title",
      description: "Updated Task Description",
      dueDate: new Date().toISOString(),
      progress: 50,
      status: true,
    };

    const result = await supertest(web)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedData);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.title).toBe(updatedData.title);
    expect(result.body.data.description).toBe(updatedData.description);
    expect(new Date(result.body.data.dueDate).toISOString()).toBe(
      new Date(updatedData.dueDate).toISOString()
    );
    expect(result.body.data.progress).toBe(updatedData.progress);
    expect(result.body.data.status).toBe(updatedData.status);
  });

  it("should return 404 for a non-existent task", async () => {
    const nonExistentTaskId = "b14795c8-b4bf-48a7-b4cb-a8753cd17821";
    const updatedData = {
      title: "Updated Task Title",
    };

    const result = await supertest(web)
      .put(`/api/tasks/${nonExistentTaskId}`)
      .set("Authorization", "Bearer " + token)
      .send(updatedData);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });

  it("should return 400 for invalid data", async () => {
    const invalidData = {
      title: "",
      description: "Description is too short",
      dueDate: "invalid-date",
      progress: 150,
      status: "not-a-boolean",
    };

    const result = await supertest(web)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", "Bearer " + token)
      .send(invalidData);

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("DELETE /api/tasks/:taskId", () => {
  let token;
  let taskId;
  let userId;

  beforeEach(async () => {
    userId = await createTestUser();
    token = await createToken();
    const task = await createTask(userId);
    taskId = task.id;
  });

  afterEach(async () => {
    await removeAllTestTask(taskId);
    await removeTestUser();
  });

  it("should delete an existing task", async () => {
    const result = await supertest(web)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", "Bearer " + token);

    expect(result.status).toBe(204);
    const checkTask = await supertest(web)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", "Bearer " + token);

    expect(checkTask.status).toBe(404);
  });

  it("should return 404 for a non-existent task", async () => {
    const nonExistentTaskId = "b14795c8-b4bf-48a7-b4cb-a8753cd17821";

    const result = await supertest(web)
      .delete(`/api/tasks/${nonExistentTaskId}`)
      .set("Authorization", "Bearer " + token);

    expect(result.status).toBe(404);
    expect(result.body.errors).toBeDefined();
  });
});
