import { useContext } from "react";
import { Todocontext } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";

function Pendingtodo() {
  const { pending_task } = useContext(Todocontext);

  return (
    <>
      <h1 className="text-center my-4">Pending Tasks</h1>
      {pending_task.length > 0 ? (
        <ul className="list-group">
          {pending_task.map((item) => (
            <li
              key={item.id}
              className="list-group-item list-group-item-warning"
            >
              {item.task}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted">
          No pending tasks at the moment.
        </p>
      )}
    </>
  );
}

export default Pendingtodo;
