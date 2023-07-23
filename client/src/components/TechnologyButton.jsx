import React from "react";

const TechnologyButton = ({ logoImage }) => {
  return (
    <button>
      <div className="rounded-full p-1.5 w-8">
        {" "}
        <img alt="" src={logoImage} className="w-6"></img>
      </div>
    </button>
  );
};

export default TechnologyButton;
