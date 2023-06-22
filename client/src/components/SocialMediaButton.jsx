import React from "react";

const SocialMediaButton = ({ logoImage }) => {
  return (
    <button>
      <div className="bg-neutral rounded-full p-2.5">
        {" "}
        <img alt="" src={logoImage} className="w-6"></img>
      </div>
    </button>
  );
};

export default SocialMediaButton;
