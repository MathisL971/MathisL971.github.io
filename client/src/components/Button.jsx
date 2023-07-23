import React from "react";

const Button = ({ text, styles, disabled }) => {
  console.log(disabled);

  if (disabled) {
    return (
      <button
        className="rounded-full bg-sea bg-opacity-60 text-white py-3 px-6 font-ruda"
        style={styles}
        disabled
      >
        {text}
      </button>
    );
  }

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
