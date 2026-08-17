const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
 
const app = express();
 
const PORT = 5000;
 
const DATA_FILE = path.join(
  __dirname,
  "data",
  "tasks.json"
);
 
app.use(cors());
app.use(express.json());
 
async function readTasks() {
  const data = await fs.readFile(DATA_FILE, "utf-8");
 
  return JSON.parse(data);
}
 
async function writeTasks(tasks) {
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify(tasks, null, 2),
    "utf-8"
  );
}

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await readTasks();
 
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
 
    res.status(500).json({
      message: "Failed to read tasks"
    });
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const tasks = await readTasks();
 
    const id = Number(req.params.id);
 
    const task = tasks.find(
      (task) => task.id === id
    );
 
    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
 
    res.status(200).json(task);
  } catch (error) {
    console.error(error);
 
    res.status(500).json({
      message: "Failed to get task"
    });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const {
      title,
      description
    } = req.body;
 
    if (
      typeof title !== "string" ||
      title.trim() === ""
    ) {
      return res.status(400).json({
        message: "Title is required"
      });
    }
 
    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        message:
          "Description must be a string"
      });
    }

    const tasks = await readTasks();
 
    const newId =
      tasks.length === 0
        ? 1
        : Math.max(
            ...tasks.map((task) => task.id)
          ) + 1;
 
    const newTask = {
      id: newId,
 
      title: title.trim(),
 
      description:
        description?.trim() || "",
 
      completed: false,
 
      createdAt:
        new Date().toISOString()
    };
 
    tasks.push(newTask);
 
    await writeTasks(tasks);
 
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
 
    res.status(500).json({
      message: "Failed to create task"
    });
  }
});
 
app.put("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
 
    const {
      title,
      description,
      completed
    } = req.body;

    if (
      title !== undefined &&
      (
        typeof title !== "string" ||
        title.trim() === ""
      )
    ) {
      return res.status(400).json({
        message:
          "Title must be a non-empty string"
      });
    }
 
    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      return res.status(400).json({
        message:
          "Description must be a string"
      });
    }
 
    if (
      completed !== undefined &&
      typeof completed !== "boolean"
    ) {
      return res.status(400).json({
        message:
          "Completed must be a boolean"
      });
    }
 
    const tasks = await readTasks();
 
    const taskIndex = tasks.findIndex(
      (task) => task.id === id
    );

    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    const existingTask = tasks[taskIndex];
 
    const updatedTask = {
      ...existingTask,
 
      ...(title !== undefined && {
        title: title.trim()
      }),
 
      ...(description !== undefined && {
        description: description.trim()
      }),
 
      ...(completed !== undefined && {
        completed
      })
    };
 
    tasks[taskIndex] = updatedTask;

    await writeTasks(tasks);
 
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error(error);
 
    res.status(500).json({
      message: "Failed to update task"
    });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
 
    const tasks = await readTasks();
 
    const taskIndex = tasks.findIndex(
      (task) => task.id === id
    );
 
    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found"
      });
    }
 
    tasks.splice(taskIndex, 1);

    await writeTasks(tasks);
 
    res.status(204).send();
  } catch (error) {
    console.error(error);
 
    res.status(500).json({
      message: "Failed to delete task"
    });
  }
});
 
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});
 
app.listen(PORT, () => {
  console.log(
    `Server running at http://localhost:${PORT}`
  );
});
 