import React from "react";
import SocialMediaButton from "./SocialMediaButton";
import "../index.css";

const Navbar = () => {
  return (
    <div
      className="flex flex-row bg-sea justify-between border-dark border-2 rounded-full p-2 gap-20 w-fit"
      style={{ boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)" }}
    >
      <div className="flex flex-row gap-4">
        <SocialMediaButton social={"github"}></SocialMediaButton>
        <SocialMediaButton social={"linkedin"}></SocialMediaButton>
        <SocialMediaButton social={"twitter"}></SocialMediaButton>
        <SocialMediaButton social={"insta"}></SocialMediaButton>
      </div>
    </div>
  );
};

export default Navbar;
