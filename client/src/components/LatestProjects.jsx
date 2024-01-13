import React from "react";
import ProjectCard from "./ProjectCard";

import reactSvg from "../assets/icons/react.svg";
import tailwindSvg from "../assets/icons/tailwind.svg";
import mySqlSvg from "../assets/icons/mysql.svg";
import nodeSvg from "../assets/icons/node.svg";

const projects = [
  // {
  //   title: "Project 1",
  //   description:
  //     "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
  //   technologies: [reactSvg, tailwindSvg, mySqlSvg, nodeSvg],
  //   url: "https://github.com/MathisL971/pern-restaurant-review-app",
  // },
];

const LatestProjects = () => {
  return (
    <div id="my-work" className="flex flex-col w-full gap-6 py-10">
      <h3>// Latests Projects</h3>
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
        {projects.length !== 0 ? (
          projects.map((p) => {
            return (
              <ProjectCard
                title={p.title}
                description={p.description}
                technologies={p.technologies}
                url={p.url}
              ></ProjectCard>
            );
          })
        ) : (
          <p className="w-fit self-center m-auto py-2 px-4 bg-neutral rounded-3xl text-white">
            <i>Projects are cooking so stay tuned!</i>
          </p>
        )}
      </div>
    </div>
  );
};

export default LatestProjects;
