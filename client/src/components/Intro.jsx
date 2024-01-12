import React from "react";
import Button from "./Button";
import donwloadSvg from "../assets/icons/download-white.svg";

const Intro = () => {
  return (
    <div className="flex flex-col w-full gap-6">
      <h3>A Bit About Me</h3>
      <ul className="list-disc px-6 mb-2">
        <li>Born and raised in St Barts, F.W.I</li>
        <li>Lived 10 years in Montreal, Canada</li>
        <li>
          Graduated with a BComm. in Finance, IT Management & Computer Science
          from McGill University
        </li>
        <li>Mostly worked for early-stage startups (PropTech & HealthTech)</li>
        <li>
          Currently pursuing freelance web development and teaching programming
          fundamentals to highschool students
        </li>
      </ul>
      <Button
        text={"Download resume"}
        styles={{ alignSelf: "center" }}
        icon={donwloadSvg}
      />
    </div>
  );
};

export default Intro;
