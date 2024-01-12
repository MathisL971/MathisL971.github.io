import React from "react";

const Button = ({ text, styles, disabled, icon }) => {
  if (disabled) {
    return (
      <button
        className="flex w-fit rounded-xl bg-sky bg-opacity-60 text-white py-3 px-12 font-handjet text-xl gap-3"
        style={styles}
        disabled
      >
        {text}
        {icon && <img alt="" src={icon} className="w-6 h-6 self-center"></img>}
      </button>
    );
  }

  return (
    <button
      className="flex w-fit rounded-xl bg-sky text-white py-3 px-12 font-handjet text-xl gap-3"
      style={styles}
    >
      {text}
      {icon && <img alt="" src={icon} className="w-5 h-5 self-center"></img>}
    </button>
  );
};

export default Button;
