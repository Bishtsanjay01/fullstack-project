import React from "react";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";
import './styles.css';

const App = () => {
  return (

    <div>

      <Outlet />
    </div>

  );
};

export default App;
