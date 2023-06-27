import React from "react";
import Button from "./Button";
import SocialMediaButton from "./SocialMediaButton";
import "../index.css";

import githubSVG from "../assets/icons/github-white.svg";
import instaSvg from "../assets/icons/insta-white.svg";
import twitterSVG from "../assets/icons/twitter-white.svg";
import linkedInSVG from "../assets/icons/linkedin-white.svg";

const Navbar = () => {
  return (
    <div className="flex flex-row bg-white justify-between border-sea border-2 rounded-full p-2 max-w-5xl gap-20">
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
        <SocialMediaButton logoImage={instaSvg}></SocialMediaButton>
        <SocialMediaButton logoImage={githubSVG}></SocialMediaButton>
      </div>
    </div>
  );
};

export default Navbar;
