import React, { useState, useEffect } from "react";
import "../styles/ScrollDownArrow.css"; // Make sure to adjust the path based on the actual location of your CSS file.

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
      class={`demo ${atPageTop ? "" : "hidden"}`}
      className="h-16"
    >
      <a href="#section06">
        <span></span>
      </a>
    </section>
  );
};

export default ScrollDownArrow;
