import React from "react";
import SocialMediaButton from "./SocialMediaButton";
import githubSVG from "../assets/icons/github-white.svg";
import Button from "./Button";
import ProjectCard from "./ProjectCard";

const LatestProjects = () => {
  return (
    <div className="flex flex-col py-10 w-full gap-10">
      <div className="flex flex-row justify-between">
        <h2>/ Latest Projects</h2>
        <div className="flex items-center">
          <SocialMediaButton logoImage={githubSVG}></SocialMediaButton>
        </div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col gap-2 w-5/12">
          <ProjectCard
            title={"Villa ..."}
            description={
              "Designed a Squarespace website for a vacation rental property owner located Saint-Barts"
            }
          ></ProjectCard>
          <ProjectCard
            title={"Acid Capitalist"}
            description={
              "Designed a Squarespace website for Hugh Hendry's Macro Summer Camp"
            }
          ></ProjectCard>
          <ProjectCard
            title={"Real Estate Club at McGill"}
            description={
              "Redesigned McGill's real estate club's website using Squarespace over the start of my Fall 2022 semester"
            }
          ></ProjectCard>
          <ProjectCard
            title={"Baz Bar"}
            description={
              "Designed a Wix website for a sushi restaurant located in Saint-Barts"
            }
          ></ProjectCard>
        </div>
        <div className="bg-white border-2 rounded-lg w-6/12"></div>
      </div>
      <div className="flex flex-row justify-center">
        <Button text={"See All Projects"}></Button>
      </div>
    </div>
  );
};

export default LatestProjects;
