import React from "react";

const IconButton = ({ text, logoImage }) => {
  return (
    <button className="flex flex-row gap-2 rounded-full bg-sea text-white py-3 px-6 font-ruda">
      <img alt="" src={logoImage} className="w-6"></img>
      {text}
    </button>
  );
};

export default IconButton;
