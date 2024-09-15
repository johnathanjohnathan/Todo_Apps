import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);

  async function getData() {
    try {
      const token = localStorage.getItem("AuthToken");

      if (!token || token === "undefined") {
        console.error("No auth token found");
        setIsLoggedIn(false);
        return;
      }

      const response = await fetch(`http://localhost:8080/api/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();
      setTasks(json.data);
    } catch (err) {
      console.error("Fetch error: ", err);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("AuthToken");
    if (token && token !== "undefined") {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      getData();
    }
  }, [isLoggedIn]);

  return (
    <div className="app">
      {!isLoggedIn ? (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <div>
          <ListHeader listName="My Task List" getData={getData} />
          {tasks === undefined || tasks.length === 0 ? (
            <p>There are no tasks</p>
          ) : (
            <ul>
              {tasks.map((task) => (
                <ListItem key={task.id} task={task} getData={getData} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
