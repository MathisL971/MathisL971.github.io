import React from "react";

const ProjectCard = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-1 w-11/12 bg-white border-2 border-neutral rounded-lg py-4 px-6 justify-center hover:text-white hover:w-full hover:h-30 hover:px-8 hover:py-8 hover:bg-neutral">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ProjectCard;
