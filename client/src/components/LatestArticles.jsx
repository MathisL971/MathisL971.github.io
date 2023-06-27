import React from "react";
import Button from "./Button";
import IconButton from "./IconButton";

import mediumSvg from "../assets/icons/medium-white.svg";
import ArticleCard from "./ArticleCard";

const LatestArticles = () => {
  return (
    <div className="flex flex-col py-12 w-full gap-10">
      <div className="flex flex-row justify-between">
        <h2>/ Latest Articles</h2>
        <div className="flex items-center">
          <IconButton text={"Medium"} logoImage={mediumSvg}></IconButton>
        </div>
      </div>
      <div className="flex flex-row flex-nowrap gap-4 w-full">
        <ArticleCard
          title={"Coming Soon..."}
          description={
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "
          }
        ></ArticleCard>
      </div>
      <div className="flex flex-row justify-center">
        <Button text={"See All Articles"}></Button>
      </div>
    </div>
  );
};

export default LatestArticles;
