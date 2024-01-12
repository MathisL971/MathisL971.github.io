import React from "react";
import Button from "./Button";
import SocialMediaButton from "./SocialMediaButton";

const ContactBanner = () => {
  return (
    <div className="flex flex-col items-center gap-5 bg-white border-2 border-neutral rounded-lg py-7 px-14">
      <h2>Interest in working together? Or simply looking to connect?</h2>
      <p>
        Feel free to reach out to me via social media or email
        (lefrancmathis@gmail.com)
      </p>
      <div className="flex flex-row gap-3">
        <Button text={"Contact Me"} disabled={true}></Button>
        <SocialMediaButton social={"linkedin"}></SocialMediaButton>
        <SocialMediaButton social={"twitter"}></SocialMediaButton>
      </div>
    </div>
  );
};

export default ContactBanner;
