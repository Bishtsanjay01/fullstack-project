import { createContext, useReducer, useRef, useEffect, useState } from "react";
import axios from "axios";

export const Todocontext = createContext();

const reducer_func = (current_value, action) => {
  let updated_value = current_value;
  switch (action.type) {
    case "set_tasks":
      updated_value = action.payload;
      break;
    case "delete":
      updated_value = updated_value.filter(
        (item) => item.id !== action.payload
      );
      break;
    case "add":
      updated_value = [...current_value, action.payload];
      break;
    case "search":
      return action.payload; // Update state with filtered tasks from backend
    case "completed":
      updated_value = updated_value.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: action.payload.completed }
          : task
      );
      break;
    case "update":
      updated_value = updated_value.map((item) =>
        item.id === action.payload.id
          ? { ...item, task: action.payload.task }
          : item
      );
      break;
    case "reorder":
      updated_value = action.payload;
      break;
    default:
      return updated_value;
  }

  return updated_value;
};

function StoreFunctionlity({ children }) {
  const [updated_data, dispatch] = useReducer(reducer_func, []);
  const inputref = useRef();
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const pending_task = updated_data.filter((task) => !task.completed);
  const completed_task = updated_data.filter(task => task.completed);


  useEffect(() => {
    axios
      .get("http://localhost:8625/tasks")
      .then((response) => {
        dispatch({
          type: "set_tasks",
          payload: response.data,
        });
      })
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handle_delete = (id) => {
    axios
      .delete(`http://localhost:8625/tasks/${id}`)
      .then(() => {
        dispatch({
          type: "delete",
          payload: id,
        });
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handle_add = (task) => {
    axios
      .post("http://localhost:8625/tasks", { task })
      .then((response) => {
        const newTask = {
          id: response.data.taskId,
          task,
          completed: false,
        };
        dispatch({
          type: "add",
          payload: newTask,
        });
        inputref.current.value = "";
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handle_search = (task) => {
    axios
      .get(`http://localhost:8625/tasks/search/${task}`)
      .then((response) => {
        dispatch({
          type: "search",
          payload: response.data,
        });
      })
      .catch((error) => console.error("Error searching tasks:", error));
  };

  const handle_completed = (task) => {
    axios
      .put(`http://localhost:8625/tasks/completed/${task.id}`, {
        completed: !task.completed,
      })
      .then(() => {
        dispatch({
          type: "completed",
          payload: { id: task.id, completed: !task.completed },
        });
      })
      .catch((error) => console.error("Error updating task status:", error));
  };

  const handle_update = (task) => {
    inputref.current.value = task.task;
    setCurrentTaskId(task.id);
  };

  const handle_input_update = () => {
    const updatedTaskText = inputref.current.value.trim();

    if (!updatedTaskText || currentTaskId === null) {
      console.error("Task input is empty or no task selected for update");
      return;
    }

    axios
      .put(`http://localhost:8625/tasks/${currentTaskId}`, {
        task: updatedTaskText,
      })
      .then((response) => {
        if (response.status === 200) {
          dispatch({
            type: "update",
            payload: { id: currentTaskId, task: updatedTaskText },
          });
          inputref.current.value = "";
          setCurrentTaskId(null);
        } else {
          console.error("Error: Unexpected response status", response.status);
        }
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedTasks = Array.from(updated_data);
    const [movedItem] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedItem);

    // Dispatch updated state
    dispatch({ type: "set_tasks", payload: reorderedTasks });

    // Send updated order to backend
    const updatedOrder = reorderedTasks.map((task, index) => ({
      id: task.id,
      position: index, // Assign new position
    }));

    fetch("http://localhost:8625/tasks/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tasks: updatedOrder }),
    })
      .then((res) => res.json())
      .then((data) => console.log("Order updated:", data))
      .catch((error) => console.error("Error updating order:", error));
  };

  return (
    <Todocontext.Provider
      value={{
        updated_data,
        handle_update,
        handle_delete,
        handle_add,
        handle_search,
        handle_completed,
        inputref,
        handle_input_update,
        handleDragEnd,
        pending_task,
        completed_task
      }}
    >
      {children}
    </Todocontext.Provider>
  );
}

export default StoreFunctionlity;
