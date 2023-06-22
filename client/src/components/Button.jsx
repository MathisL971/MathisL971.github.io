import React from "react";

const Button = ({ text }) => {
  return (
    <button className="rounded-full bg-neutral text-white py-2 px-6 font-ruda">
      {text}
    </button>
  );
};

export default Button;
