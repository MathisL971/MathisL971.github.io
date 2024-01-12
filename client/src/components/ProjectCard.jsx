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
      onMouseOver={() => {
        onHover(title);
      }}
      onClick={() => window.open(url, "_blank")}
      className="flex flex-col gap-1 w-10/12 bg-white border-2 border-sea rounded-lg py-4 px-6 hover:bg-sea hover:border-none hover:cursor-pointer transition ease-in-out delay-50 hover:-translate-y-1 hover:scale-110 duration-200"
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
