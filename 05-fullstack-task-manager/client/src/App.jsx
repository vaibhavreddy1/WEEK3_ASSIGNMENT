import { useEffect, useMemo, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch tasks"
        );
      }

      const data = await response.json();

      setTasks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setAdding(true);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: title.trim(),
            description:
              description.trim(),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Failed to create task"
        );
      }

      const newTask =
        await response.json();

      setTasks((currentTasks) => [
        ...currentTasks,
        newTask,
      ]);

      setTitle("");
      setDescription("");
    } catch (error) {
      setError(error.message);
    } finally {
      setAdding(false);
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(
      task.description
    );
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleUpdateTask = async (taskId) => {
    if (!editTitle.trim()) {
      return;
    }

    try {
      setSavingId(taskId);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks/${taskId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            title: editTitle.trim(),
            description:
              editDescription.trim(),
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Failed to update task"
        );
      }

      const updatedTask =
        await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? updatedTask
            : task
        )
      );

      cancelEditing();
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      setSavingId(task.id);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            completed:
              !task.completed,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Failed to update task"
        );
      }

      const updatedTask =
        await response.json();

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === task.id
            ? updatedTask
            : currentTask
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(task.id);
      setError("");

      const response = await fetch(
        `${API_URL}/tasks/${task.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();

        throw new Error(
          data.message ||
            "Failed to delete task"
        );
      }

      setTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active") {
        return !task.completed;
      }

      if (filter === "completed") {
        return task.completed;
      }

      return true;
    });
  }, [tasks, filter]);

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const activeCount =
    tasks.length - completedCount;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>

        <p>Loading your tasks...</p>
      </div>
    );
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <p className="eyebrow">
            Full-Stack · Express + React
          </p>

          <h1>Task Manager</h1>

          <p className="subtitle">
            Organize your work with a simple
            full-stack task manager.
          </p>
        </div>

        <div className="stats">
          <div>
            <strong>
              {tasks.length}
            </strong>

            <span>Total</span>
          </div>

          <div>
            <strong>
              {activeCount}
            </strong>

            <span>Active</span>
          </div>

          <div>
            <strong>
              {completedCount}
            </strong>

            <span>Done</span>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-box">
          <div>
            <strong>
              Something went wrong
            </strong>

            <p>{error}</p>
          </div>

          <button
            onClick={() => setError("")}
          >
            ×
          </button>
        </div>
      )}

      <section className="add-card">
        <div className="section-title">
          <div>
            <p className="eyebrow">
              New task
            </p>

            <h2>Add a task</h2>
          </div>
        </div>

        <form onSubmit={handleAddTask}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                Title
              </label>

              <input
                id="title"
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                rows="3"
                placeholder="Add some details..."
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-button"
              disabled={
                adding ||
                !title.trim()
              }
            >
              {adding
                ? "Adding..."
                : "Add task"}
            </button>
          </div>
        </form>
      </section>

      <section className="tasks-section">

        <div className="tasks-header">

          <div>
            <p className="eyebrow">
              Your tasks
            </p>

            <h2>
              {filteredTasks.length} tasks
            </h2>
          </div>

          {/* Filters */}

          <div className="filters">

            <button
              className={
                filter === "all"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("all")
              }
            >
              All
            </button>

            <button
              className={
                filter === "active"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("active")
              }
            >
              Active
            </button>

            <button
              className={
                filter === "completed"
                  ? "filter active"
                  : "filter"
              }
              onClick={() =>
                setFilter("completed")
              }
            >
              Completed
            </button>

          </div>

        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">

            <div className="empty-icon">
              ✓
            </div>

            <h3>
              {filter === "all"
                ? "No tasks yet"
                : `No ${filter} tasks`}
            </h3>

            <p>
              {filter === "all"
                ? "Add your first task above."
                : "Try another filter."}
            </p>

          </div>
        ) : (

          <div className="task-list">

            {filteredTasks.map((task) => {

              const isEditing =
                editingId === task.id;

              const isSaving =
                savingId === task.id;

              const isDeleting =
                deletingId === task.id;

              return (
                <article
                  className={
                    task.completed
                      ? "task-card completed"
                      : "task-card"
                  }
                  key={task.id}
                >

                  {!isEditing ? (
                    <>
                      <div className="task-main">

                        <button
                          className={
                            task.completed
                              ? "complete-button checked"
                              : "complete-button"
                          }
                          onClick={() =>
                            handleToggleTask(
                              task
                            )
                          }
                          disabled={isSaving}
                          aria-label={
                            task.completed
                              ? "Mark task active"
                              : "Mark task completed"
                          }
                        >
                          {task.completed
                            ? "✓"
                            : ""}
                        </button>

                        <div className="task-content">

                          <h3>
                            {task.title}
                          </h3>

                          {task.description && (
                            <p>
                              {task.description}
                            </p>
                          )}

                          <span className="created-date">
                            Created{" "}
                            {new Date(
                              task.createdAt
                            ).toLocaleDateString()}
                          </span>

                        </div>

                      </div>

                      <div className="task-actions">

                        <button
                          className="edit-button"
                          onClick={() =>
                            startEditing(
                              task
                            )
                          }
                          disabled={
                            isSaving ||
                            isDeleting
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDeleteTask(
                              task
                            )
                          }
                          disabled={
                            isSaving ||
                            isDeleting
                          }
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </>
                  ) : (

                    <div className="edit-form">

                      <div className="form-group">
                        <label>
                          Title
                        </label>

                        <input
                          type="text"
                          value={editTitle}
                          onChange={(event) =>
                            setEditTitle(
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Description
                        </label>

                        <textarea
                          rows="3"
                          value={
                            editDescription
                          }
                          onChange={(event) =>
                            setEditDescription(
                              event.target.value
                            )
                          }
                        />
                      </div>

                      <div className="edit-actions">

                        <button
                          className="primary-button"
                          onClick={() =>
                            handleUpdateTask(
                              task.id
                            )
                          }
                          disabled={
                            isSaving ||
                            !editTitle.trim()
                          }
                        >
                          {isSaving
                            ? "Saving..."
                            : "Save changes"}
                        </button>

                        <button
                          className="secondary-button"
                          onClick={
                            cancelEditing
                          }
                          disabled={isSaving}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>
                  )}

                </article>
              );
            })}

          </div>
        )}

      </section>
    </div>
  );
}

export default App;


