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
        <Button text="Home" disabled={false}></Button>
        <Button text="About Me" disabled={true}></Button>
        <Button text="Projects" disabled={true}></Button>
        <Button text="Writings" disabled={true}></Button>
      </div>
      <div className="flex flex-row space-x-4">
        <Button text="Contact Me" disabled={true}></Button>
        <SocialMediaButton
          logoImage={linkedInSVG}
          url={"https://www.linkedin.com/in/mathis-lefranc/"}
        ></SocialMediaButton>
        <SocialMediaButton
          logoImage={githubSVG}
          url={"https://github.com/MathisL971"}
        ></SocialMediaButton>
        <SocialMediaButton
          logoImage={twitterSVG}
          url={"https://twitter.com/hedgiesTTG"}
        ></SocialMediaButton>
        <SocialMediaButton
          logoImage={instaSvg}
          url={"https://www.instagram.com/mathisl.971/"}
        ></SocialMediaButton>
      </div>
    </div>
  );
};

export default Navbar;
