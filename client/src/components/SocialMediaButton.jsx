import React from "react";

const SocialMediaButton = ({ logoImage, url }) => {
  return (
    <button type="button" onClick={() => window.open(url, "_blank")}>
      <div className="bg-sea rounded-full p-2.5 hover:bg-sky">
        {" "}
        <img alt="" src={logoImage} className="w-6"></img>
      </div>
    </button>
  );
};

export default SocialMediaButton;
