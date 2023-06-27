import React from "react";
import githubSVG from "../assets/icons/github-white.svg";
import Button from "./Button";
import ProjectCard from "./ProjectCard";
import { useState } from "react";
import IconButton from "./IconButton";

import bazImage from "/Users/mathis/Sync/web_dev/fullstack/react-portfolio-app/client/src/assets/bazbar-home.png";
import acidImage from "/Users/mathis/Sync/web_dev/fullstack/react-portfolio-app/client/src/assets/acid-capitalist-home.png";
import recImage from "/Users/mathis/Sync/web_dev/fullstack/react-portfolio-app/client/src/assets/mre-home.png";
import villaImage from "/Users/mathis/Sync/web_dev/fullstack/react-portfolio-app/client/src/assets/villa-home.jpg";

const LatestProjects = () => {
  const [projectImage, setProjectImage] = useState("");

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
      case "Villa": {
        image = villaImage;
        break;
      }
      default:
        console.log("Do nothing");
    }

    console.log(image);
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
            title={"Villa"}
            description={
              "Designed a Squarespace website for a vacation rental owner in St Barts"
            }
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Acid Capitalist"}
            description={
              "Designed a Squarespace website for Hugh Hendry's Macro Summer Camp"
            }
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Real Estate Club at McGill"}
            description={
              "Redesigned McGill's real estate club's website using Squarespace"
            }
            onHover={handleProjectImageChange}
          ></ProjectCard>
          <ProjectCard
            title={"Baz Bar"}
            description={
              "Designed a Wix website for a sushi restaurant located in Saint-Barts"
            }
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
