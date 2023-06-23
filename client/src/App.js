import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./index.css";
import LatestProjects from "./components/LatestProjects";

const App = () => {
  return (
    <div className="flex flex-col gap-6 bg-light py-14 px-48 items-center">
      <Navbar></Navbar>
      <Home></Home>
      <LatestProjects></LatestProjects>
    </div>
  );
};

export default App;
