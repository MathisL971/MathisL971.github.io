import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./index.css";
import LatestProjects from "./components/LatestProjects";
import Intro from "./components/Intro";
import Footer from "./components/Footer";

const App = () => {
  return (
    <>
      <div className="flex flex-col gap-10 bg-light items-center py-12 px-8 md:px-20 lg:px-48">
        <div className="flex flex-col gap-14 lg:gap-16 items-center w-full">
          <Navbar></Navbar>
          <Home></Home>
        </div>
        <Intro></Intro>
        <LatestProjects></LatestProjects>
      </div>
      <Footer />
    </>
  );
};

export default App;
