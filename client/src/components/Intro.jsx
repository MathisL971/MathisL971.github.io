import React from "react";
import Button from "./Button";
import donwloadSvg from "../assets/icons/download-white.svg";

import resume from "../assets/files/Resume_January_2024_Mathis_Lefranc.pdf";

const Intro = () => {
  const handleDownloadClick = () => {
    // Replace "your_resume.pdf" with the actual path to your resume file
    const resumeUrl = resume;
    // Create a link element
    const downloadLink = document.createElement("a");

    // Set the download attribute and href for the link
    downloadLink.download = "resume_mathis_lefranc.pdf";
    downloadLink.href = resumeUrl;

    // Append the link to the body
    document.body.appendChild(downloadLink);

    // Trigger a click on the link to start the download
    downloadLink.click();

    // Remove the link from the body
    document.body.removeChild(downloadLink);
  };

  return (
    <div id="about-me" className="flex flex-col w-full gap-6 pt-10">
      <h3>// A Bit About Me</h3>
      <ul
        className="list-disc px-6 mb-2 font-rajdhani"
        style={{ fontSize: "20px" }}
      >
        <li>Born and raised in St. Barts, F.W.I</li>
        <li>Lived 10 years in Montreal, Canada</li>
        <li>
          Graduated with a BCom. in Finance, IT Management & Computer Science
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
        styles={{
          alignSelf: "center",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
        icon={donwloadSvg}
        onClick={handleDownloadClick}
      />
    </div>
  );
};

export default Intro;
