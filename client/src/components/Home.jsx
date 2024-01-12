import React from "react";
import Button from "./Button";
import ScrollDownArrow from "./ScrollDownArrow";

const Home = () => {
  return (
    <div className="flex flex-col justify-between h-115">
      <div className="flex flex-row gap-20 items-center justify-between">
        <div className="flex flex-col justify-between">
          <p className="text-3xl">Full Stack Web Developer</p>
          <div>
            <h1>Hey,</h1>
            <h1>I'm Mathis!</h1>
          </div>
          <p className="text-4xl">Welcome to my corner of the internet.</p>
          <span className="flex flex-row gap-3 mt-4">
            <Button
              text="About Me"
              disabled={false}
              styles={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            ></Button>
            <Button
              text="My Work"
              disabled={false}
              styles={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
            ></Button>
          </span>
        </div>
        <div className="hidden lg:flex flex-col rounded-full border-4 bg-cover bg-no-repeat w-105 h-105 items-end justify-between py-10 bg-mtl-map">
          <span className="self-start py-2 px-5 bg-white rounded-full border-2">
            <p>Currently in...</p>
          </span>
          <span className="self-end py-2 px-5 bg-white rounded-full border-2">
            <p>Montreal, Canada</p>
          </span>
        </div>
      </div>
      <div className="flex flex-row w-full h-fit mt-8">
        <ScrollDownArrow></ScrollDownArrow>
      </div>
    </div>
  );
};

export default Home;
