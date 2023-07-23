import React from "react";

const Button = ({ text, styles }) => {
  return (
    <button
      className="rounded-full bg-sea text-white py-3 px-6 font-ruda hover:bg-sky"
      style={styles}
    >
      {text}
    </button>
  );
};

export default Button;
