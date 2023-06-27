import React from "react";

const ProjectCard = ({ title, description, onHover }) => {
  return (
    <div
      onMouseOver={() => onHover(title)}
      className="flex flex-col gap-1 w-10/12 bg-white border-2 border-neutral rounded-lg py-4 px-6 justify-center hover:text-sky hover:w-11/12 hover:h-30 hover:px-8 hover:py-8 hover:bg-neutral"
    >
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
};

export default ProjectCard;
