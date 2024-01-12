import React, { useState, useEffect } from "react";
import "../styles/ScrollDownArrow.css"; // Make sure to adjust the path based on the actual location of your CSS file.
import customDownArrow from "../assets/icons/custom-down-arrow.svg";

const ScrollDownArrow = () => {
  const [atPageTop, setAtPageTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Adjust the scroll threshold value according to your requirement
      const scrollThreshold = 20;
      setAtPageTop(currentScrollY < scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      id="section05"
      className={`flex justify-center transition-opacity duration-300 ease-in ${
        atPageTop ? "" : "opacity-0"
      }`}
    >
      <img alt="" src={customDownArrow} className="w-12 h-12"></img>
    </section>
  );
};

export default ScrollDownArrow;
