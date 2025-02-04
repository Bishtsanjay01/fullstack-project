import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import StoreFunctionlity from "./store/store.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Completedtodo from "./components/completedtodo.jsx";
import Pendingtodo from "./components/Pendingtodo.jsx";
import Task from "./components/Task.jsx";
import RegisterForm from "./components/RegisterForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import App1 from "./App1.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <RegisterForm />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
    ],
  },
  {
    path: "/app1",
    element: <App1 />,
    children: [
      {
        path: "/app1",
        element: <Task />,
      },
      {
        path: "/app1/completedtodo",
        element: <Completedtodo />,
      },
      {
        path: "/app1/pendingtodo",
        element: <Pendingtodo />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StoreFunctionlity>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StoreFunctionlity>
);
