import TickIcon from "./TickIcon";
import ProgressBar from "./ProgressBar";
import Modal from "./Modal";
import { useState } from "react";

function ListItem({ task, getData }) {
  const [showModal, setShowModal] = useState(false);

  async function deleteItem(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("AuthToken");
      const response = await fetch(
        `http://localhost:8080/api/tasks/${task.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 204) {
        getData();
      } else {
        console.error("Failed to delete task", response.status);
      }
    } catch (err) {
      console.error("Error during DELETE request", err);
    }
  }

  return (
    <li className="list-item">
      <div className="info-container">
        <TickIcon />
        <p className="task-title">{task.title}</p>
        <ProgressBar progress={task.progress} />
      </div>

      <div className="button-container">
        <button className="edit" onClick={() => setShowModal(true)}>
          DETAIL
        </button>
        <button className="delete" onClick={(e) => deleteItem(e)}>
          DELETE
        </button>
      </div>
      {showModal && (
        <Modal
          mode={"edit"}
          setShowModal={setShowModal}
          getData={getData}
          task={task}
        />
      )}
    </li>
  );
}

export default ListItem;
