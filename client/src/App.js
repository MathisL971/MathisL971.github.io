import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./index.css";

const App = () => {
  return (
    <div className="flex flex-col gap-6 bg-light py-8 px-48 items-center">
      <Navbar></Navbar>
      <Home></Home>
    </div>
  );
};

export default App;
