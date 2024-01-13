import React from "react";
import Button from "./Button";
import ScrollDownArrow from "./ScrollDownArrow";

const Home = () => {
  const scrollToLocation = (sectionId) => {
    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start", // Align the top of the element to the top of the window
        inline: "nearest", // Keep the nearest edge of the element visible
      });
    }
  };

  return (
    <div className="flex flex-col justify-between h-115 w-full">
      <div className="flex flex-row gap-20 items-center justify-between">
        <div className="flex flex-col justify-between md:gap-2 lg:gap-6">
          <p className="text-2xl">
            <b>// Full Stack Web Developer</b>
          </p>
          <div>
            <h1>Hey,</h1>
            <h1>I'm Mathis!</h1>
          </div>
          <p className="text-3xl lg:text-4xl">
            <b>Welcome to my corner of the internet</b>
          </p>
          <span className="flex flex-row gap-3 mt-4">
            <Button
              text="About Me"
              disabled={false}
              styles={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
              onClick={() => scrollToLocation("about-me")}
            ></Button>
            <Button
              text="My Work"
              disabled={false}
              styles={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
              onClick={() => scrollToLocation("my-work")}
            ></Button>
          </span>
        </div>
        <div className="hidden xl:flex flex-col rounded-full border-4 border-dark bg-cover bg-no-repeat w-105 h-105 items-end justify-between py-10 bg-mtl-map">
          <span className="self-start py-2 px-5 bg-sea rounded-full border-2 border-dark">
            <p className="text-white">Currently in...</p>
          </span>
          <span className="self-end py-2 px-5 bg-sea rounded-full border-2 border-dark">
            <p className="text-white">Montreal, Canada</p>
          </span>
        </div>
      </div>
      <div className="flex flex-row w-full h-fit mt-10 lg:mt-20">
        <ScrollDownArrow></ScrollDownArrow>
      </div>
    </div>
  );
};

export default Home;
