import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap is imported

function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 justify-content-center">
            <li className="nav-item">
              <Link className="nav-link" to="/app1">
                Tasks |
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app1/completedtodo">
                Completed Tasks |
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/app1/pendingtodo">
                Pending Tasks
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
