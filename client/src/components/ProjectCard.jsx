import React from "react";
import openInNewWindow from "../assets/icons/open-in-new-window.svg";

const ProjectCard = ({ title, description, technologies, url }) => {
  return (
    <div
      className="flex flex-col bg-sea rounded-lg shadow gap-2.5 p-5"
      style={{ maxWidth: `${window.innerWidth >= 1200 ? "48%" : "none"}` }}
    >
      <div className="self-stretch flex-col justify-start items-center gap-3 flex">
        <div className="self-stretch justify-between items-center inline-flex">
          <div className="text-center text-white text-2xl font-bold font-['Handjet']">
            [{title}]
          </div>
          <img
            alt=""
            onClick={() => window.open(url, "_blank")}
            src={openInNewWindow}
          />
        </div>
        <div className="self-stretch text-white font-rajdhani">
          {description}
        </div>
        <div className="self-stretch px-[15px] py-2.5 rounded-[10px] border-2 border-neutral justify-start items-center gap-3 inline-flex">
          <div className="text-white text-[22px] font-normal font-['Handjet']">
            Stack:
          </div>
          <div className="grow shrink basis-0 h-10 justify-center items-center gap-5 flex">
            {technologies.map((tech) => {
              return <img key={tech} alt="" className="w-9 h-9" src={tech} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
