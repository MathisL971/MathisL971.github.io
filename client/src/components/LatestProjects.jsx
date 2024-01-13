import React from "react";
import ProjectCard from "./ProjectCard";

import reactSvg from "../assets/icons/react.svg";
import tailwindSvg from "../assets/icons/tailwind.svg";
import mySqlSvg from "../assets/icons/mysql.svg";
import nodeSvg from "../assets/icons/node.svg";

const LatestProjects = () => {
  return (
    <div id="my-work" className="flex flex-col w-full gap-6 py-10">
      <h3>// Latests Projects</h3>
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap">
        <ProjectCard
          title={"Test Project"}
          description={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
          technologies={[reactSvg, tailwindSvg, mySqlSvg, nodeSvg]}
          url={"https://github.com/MathisL971/pern-restaurant-review-app"}
        ></ProjectCard>
        <ProjectCard
          title={"Test Project"}
          description={
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
          }
          technologies={[reactSvg, tailwindSvg, mySqlSvg, nodeSvg]}
          url={"https://github.com/MathisL971/pern-restaurant-review-app"}
        ></ProjectCard>
      </div>
    </div>
  );
};

export default LatestProjects;
