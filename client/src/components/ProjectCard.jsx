import React from "react";
import TechnologyButton from "./TechnologyButton";

const ProjectCard = ({
  title,
  description,
  technologiesLogo,
  onHover,
  url,
}) => {
  return (
    <div
      onMouseOver={() => onHover(title)}
      onClick={() => window.open(url, "_blank")}
      className="flex flex-col gap-1 w-10/12 bg-white text-black border-2 border-neutral rounded-lg py-4 px-6 justify-center hover:text-white hover:w-11/12 hover:h-30 hover:px-8 hover:py-8 hover:bg-neutral hover:border-none hover:cursor-pointer"
    >
      <div className="flex flex-row justify-between">
        <h3>{title}</h3>
        <span className="flex flex-row">
          {technologiesLogo.map((logo) => {
            return (
              <TechnologyButton
                key={logo.id}
                logoImage={logo.image}
              ></TechnologyButton>
            );
          })}
        </span>
      </div>
      <p>{description}</p>
    </div>
  );
};

export default ProjectCard;
