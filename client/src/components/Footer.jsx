import React from "react";
import Navbar from "./Navbar";

const Footer = () => {
  return (
    <div className="flex flex-col gap-10 bg-neutral py-10 px-8 md:px-20 lg:px-48">
      <div className="flex flex-col gap-2">
        <h2
          className="font-handjet text-white font-bold"
          style={{ fontSize: "40px" }}
        >
          Interested in collaborating? Or simply looking to connect?
        </h2>
        <p className="text-white font-light" style={{ fontSize: "24px" }}>
          Feel free to get in touch with me via any of the following socials!
        </p>
      </div>
      <Navbar />
    </div>
  );
};

export default Footer;
