import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./index.css";
import LatestProjects from "./components/LatestProjects";
import LatestArticles from "./components/LatestArticles";
import ContactBanner from "./components/ContactBanner";
import Intro from "./components/Intro";

const App = () => {
  return (
    <div className="flex flex-col gap-20 bg-light items-center py-10 px-6 md:px-10 lg:px-14">
      <div className="flex flex-col gap-10 items-center">
        <Navbar></Navbar>
        <Home></Home>
      </div>
      <Intro></Intro>
      {/* <LatestProjects></LatestProjects> */}
      {/* <LatestArticles></LatestArticles> */}
      {/* <ContactBanner></ContactBanner> */}
    </div>
  );
};

export default App;
