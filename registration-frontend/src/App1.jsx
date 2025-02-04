import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Input from "./components/Input";
import Navbar from "./components/Navbar";

function App1() {
  return (
    <>
      <center>
        <Header />
        <Input />
        <Navbar />
        <Outlet />
      </center>
    </>
  );
}

export default App1;
