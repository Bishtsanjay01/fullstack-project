import { useContext } from "react";
import { Todocontext } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";

function Completedtodo() {
  const { completed_task } = useContext(Todocontext);

  return (
    <>
      <h1 className="text-center my-4">Completed Tasks</h1>
      {completed_task.length > 0 ? (
        <ul className="list-group">
          {completed_task.map((item) => (
            <li
              key={item.id}
              className="list-group-item list-group-item-success"
            >
              {item.task}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">No completed tasks yet.</p>
      )}
    </>
  );
}

export default Completedtodo;
