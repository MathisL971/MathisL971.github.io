import React from "react";
import Button from "./Button";
import SocialMediaButton from "./SocialMediaButton";
import "../index.css";

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
        <SocialMediaButton social={"linkedin"}></SocialMediaButton>
        <SocialMediaButton social={"github"}></SocialMediaButton>
        <SocialMediaButton social={"twitter"}></SocialMediaButton>
        <SocialMediaButton social={"insta"}></SocialMediaButton>
      </div>
    </div>
  );
};

export default Navbar;
