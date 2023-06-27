import React from "react";

const Button = ({ text }) => {
  return (
    <button className="rounded-full bg-sea text-white py-3 px-6 font-ruda">
      {text}
    </button>
  );
};

export default Button;
