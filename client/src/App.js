import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import "./index.css";
import LatestProjects from "./components/LatestProjects";
import LatestArticles from "./components/LatestArticles";
import ContactBanner from "./components/ContactBanner";

const App = () => {
  return (
    <div className="flex flex-col gap-6 bg-light py-14 px-48 items-center">
      <Navbar></Navbar>
      <Home></Home>
      <LatestProjects></LatestProjects>
      <LatestArticles></LatestArticles>
      <ContactBanner></ContactBanner>
    </div>
  );
};

export default App;
