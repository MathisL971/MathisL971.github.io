import React from "react";
import Button from "./Button";
import ProjectCard from "./ProjectCard";
import { useState, useEffect } from "react";
import IconButton from "./IconButton";

import githubSVG from "../assets/icons/github-white.svg";
import squarespaceSVGBlack from "../assets/icons/squarespace-black.svg";
import wixSVGBlack from "../assets/icons/wix-black.svg";

import bazImage from "../assets/bazbar-home.png";
import acidImage from "../assets/acid-capitalist-home.png";
import recImage from "../assets/mre-home.png";
import villaImage from "../assets/kirstys-home.png";

const techLogos = {
  squarespace: {
    image: squarespaceSVGBlack,
    id: 1,
  },
  wix: {
    image: wixSVGBlack,
    id: 2,
  },
};

const LatestProjects = () => {
  const [projectImage, setProjectImage] = useState("");

  useEffect(() => {
    setProjectImage(villaImage);
  }, []);

  const handleProjectImageChange = (title) => {
    let image = "";

    switch (title) {
      case "Baz Bar": {
        image = bazImage;
        break;
      }
      case "Real Estate Club at McGill": {
        image = recImage;
        break;
      }
      case "Acid Capitalist": {
        image = acidImage;
        break;
      }
      case "Kirsty's Place": {
        image = villaImage;
        break;
      }
      default:
        console.log("Do nothing");
    }

    setProjectImage(image);
  };

  return (
    <div className="flex flex-col py-12 w-full gap-10">
      <div className="flex flex-row justify-between">
        <h2>/ Latest Projects</h2>
        <div className="flex items-center">
          <IconButton logoImage={githubSVG} text={"Github"}></IconButton>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2 w-4/12">
          <ProjectCard
            title={"Kirsty's Place"}
            description={
              "Designed a Squarespace website for a vacation rental owner in St Barts"
            }
            url={"https://kirstys.squarespace.com/"}
            technologiesLogo={[techLogos.squarespace]}
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Acid Capitalist"}
            description={
              "Designed a Squarespace website for Hugh Hendry's Macro Summer Camp"
            }
            url={"https://www.acidcapitalretreat.com/"}
            technologiesLogo={[techLogos.squarespace]}
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Real Estate Club at McGill"}
            description={
              "Redesigned McGill's real estate club's website using Squarespace"
            }
            url={"https://www.realestateclubmcgill.com/"}
            technologiesLogo={[techLogos.squarespace]}
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Baz Bar"}
            description={
              "Designed a Wix website for a sushi restaurant located in Saint-Barts"
            }
            url={"https://www.bazbar.com/"}
            technologiesLogo={[techLogos.wix]}
            onHover={handleProjectImageChange}
          ></ProjectCard>
        </div>
        <div className="rounded-lg w-8/12">
          <img
            alt={"pic"}
            src={projectImage}
            className="w-full h-full rounded-lg"
          ></img>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <Button text={"See All Projects"}></Button>
      </div>
    </div>
  );
};

export default LatestProjects;
