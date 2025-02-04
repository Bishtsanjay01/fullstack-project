import { useContext } from "react";
import { Todocontext } from "../store/store";
import "bootstrap/dist/css/bootstrap.min.css";

function Input() {
  const { handle_add, inputref, handle_input_update } =
    useContext(Todocontext);
  return (
    <>
      <div className="input-group mb-3">
        <input
          className="form-control"
          placeholder="Enter What To Do....."
          type="text"
          ref={inputref}
        />
        <button
          className="btn btn-success ms-2"
          onClick={() => handle_add(inputref.current.value)}
        >
          Add
        </button>

        <button
          className="btn btn-secondary ms-2"
          onClick={handle_input_update}
        >
          Update
        </button>
      </div>
    </>
  );
}

export default Input;
