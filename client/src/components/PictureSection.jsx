import React from "react";

const PictureSection = ({ altProp, src, styles }) => {
  return <img alt={altProp} src={src} className={styles}></img>;
};

export default PictureSection;
