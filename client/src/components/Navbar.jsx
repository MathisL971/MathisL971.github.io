import React from "react";
import Button from "./Button";
import SocialMediaButton from "./SocialMediaButton";
import "../index.css";

import githubSVG from "../assets/github.svg";
import figmaSVG from "../assets/figma-white.svg";
import linkedInSVG from "../assets/linkedin-white.svg";
import twitterSVG from "../assets/twitter.svg";

const Navbar = () => {
  return (
    <div className="flex flex-row bg-white justify-between border-neutral border-2 rounded-full p-2 max-w-5xl gap-20">
      <div className="flex flex-row space-x-4">
        <Button text="Home"></Button>
        <Button text="About Me"></Button>
        <Button text="My Work"></Button>
        <Button text="My Blog"></Button>
        <Button text="Contact Me"></Button>
      </div>
      <div className="flex flex-row space-x-4">
        <SocialMediaButton logoImage={linkedInSVG}></SocialMediaButton>
        <SocialMediaButton logoImage={twitterSVG}></SocialMediaButton>
        <SocialMediaButton logoImage={githubSVG}></SocialMediaButton>
        <SocialMediaButton logoImage={figmaSVG}></SocialMediaButton>
      </div>
    </div>
  );
};

export default Navbar;
