import React from "react";
import Button from "./Button";

const Home = () => {
  return (
    <div className="flex flex-row gap-20 h-120 items-center justify-between">
      <div className="flex flex-col gap-8 justify-between">
        <p className="text-xl">Web Designer / Software Developer</p>
        <div>
          <h1>Hey,</h1>
          <h1>I'm Mathis!</h1>
        </div>
        <p className="text-4xl">Welcome to my corner of the internet.</p>
        <span className="flex flex-row gap-3">
          <Button text="About Me"></Button>
          <Button text="My Work"></Button>
        </span>
      </div>
      <div className="flex flex-col rounded-full border-4 bg-cover bg-no-repeat w-105 h-105 items-end justify-between py-10 bg-mtl-map">
        <span className="self-start py-2 px-5 bg-white rounded-full border-2">
          <p>Currently in...</p>
        </span>
        <span className="self-end py-2 px-5 bg-white rounded-full border-2">
          <p>Montreal, Canada</p>
        </span>
      </div>
    </div>
  );
};

export default Home;
