import { useState } from "react";
import { format } from "date-fns";

function Modal({ mode, setShowModal, getData, task }) {
  const editMode = mode === "edit";
  const [data, setData] = useState({
    title: editMode ? task.title : "",
    description: editMode ? task.description : "no description",
    dueDate: editMode ? format(task.dueDate, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
    progress: editMode ? task.progress : 50,
    status: editMode ? task.status : false,
  });

  async function postData(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("AuthToken");
      const response = await fetch(`http://localhost:8080/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setShowModal(false);
        getData();
      } else {
        console.error("Failed to add task", response.status);
      }
    } catch (err) {
      console.error("Error during POST request", err);
    }
  }

  async function editData(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("AuthToken");
      const response = await fetch(
        `http://localhost:8080/api/tasks/${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        setShowModal(false);
        getData();
      } else {
        console.error("Failed to edit task", response.status);
      }
    } catch (err) {
      console.error("Error during PUT request", err);
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="form-title-container">
          <h3>Let's {editMode ? "edit" : "add"} your task</h3>
          <button onClick={() => setShowModal(false)}>X</button>
        </div>

        <form>
          <input
            required
            maxLength={100}
            placeholder="Task title"
            name="title"
            value={data.title}
            onChange={handleChange}
          />
          <br />
          <textarea
            placeholder="Task description"
            name="description"
            value={data.description}
            onChange={handleChange}
            maxLength={100}
          />
          <br />
          <label htmlFor="range">Drag to select your current progress</label>
          <input
            required
            type="range"
            id="range"
            min="0"
            max="100"
            name="progress"
            value={data.progress}
            onChange={handleChange}
          />
          <br />
          <label htmlFor="date">Due Date</label>
          <input
            type="date"
            id="date"
            name="dueDate"
            value={data.dueDate}
            onChange={handleChange}
          />
          <br />
          <label>
            <input
              type="checkbox"
              name="status"
              checked={data.status}
              onChange={handleChange}
            />
            Completed
          </label>
          <br />
          <input
            className={editMode ? "edit" : "create"}
            type="submit"
            value={editMode ? "Save Changes" : "Add Task"}
            onClick={(e) => {
              if (editMode) {
                editData(e);
              } else {
                postData(e);
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}

export default Modal;
