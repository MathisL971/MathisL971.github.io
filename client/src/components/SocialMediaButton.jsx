import React from "react";

import linkedInSvg from "../assets/icons/linkedin-white.svg";
import twitterSvg from "../assets/icons/twitter-white.svg";
import githubSVG from "../assets/icons/github-white.svg";
import instaSvg from "../assets/icons/insta-white.svg";

const linkedInUrl = "https://www.linkedin.com/in/mathis-lefranc/";
const twitterUrl = "https://twitter.com/hedgiesTTG";
const githubUrl = "https://github.com/MathisL971";
const instaUrl = "https://www.instagram.com/mathisl.971/";

const SocialMediaButton = ({ social }) => {
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
    <button type="button" onClick={() => window.open(socialUrl, "_blank")}>
      <div className="bg-sky rounded-full p-2 hover:bg-sky">
        {" "}
        <img alt="" src={logoImage} className="w-6"></img>
      </div>
    </button>
  );
};

export default SocialMediaButton;
