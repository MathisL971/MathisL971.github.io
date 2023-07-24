import React from "react";

import linkedInSvg from "../assets/icons/linkedin-white.svg";
import twitterSvg from "../assets/icons/twitter-white.svg";
import mediumSvg from "../assets/icons/medium-white.svg";
import githubSVG from "../assets/icons/github-white.svg";
import instaSvg from "../assets/icons/insta-white.svg";

const linkedInUrl = "https://www.linkedin.com/in/mathis-lefranc/";
const twitterUrl = "https://www.linkedin.com/in/mathis-lefranc/";
const mediumUrl = "https://www.linkedin.com/in/mathis-lefranc/";
const githubUrl = "https://www.linkedin.com/in/mathis-lefranc/";
const instaUrl = "https://www.linkedin.com/in/mathis-lefranc/";

const IconButton = ({ social }) => {
  let logoImage;
  let socialUrl;

  switch (social) {
    case "twitter":
      logoImage = twitterSvg;
      socialUrl = twitterUrl;
      break;
    case "linkedin":
      logoImage = linkedInSvg;
      socialUrl = linkedInUrl;
      break;
    case "medium":
      logoImage = mediumSvg;
      socialUrl = mediumUrl;
      break;
    case "github":
      logoImage = githubSVG;
      socialUrl = githubUrl;
      break;
    case "insta":
      logoImage = instaSvg;
      socialUrl = instaUrl;
      break;
    default:
      logoImage = null;
  }
  return (
    <button
      type="button"
      onClick={() => window.open(socialUrl, "_blank")}
      className="flex flex-row gap-2 rounded-full bg-sea text-white py-3 px-6 font-ruda hover:bg-sky"
    >
      <img alt="" src={logoImage} className="w-6"></img>
      {social.charAt(0).toUpperCase() + social.slice(1)}
    </button>
  );
};

export default IconButton;
