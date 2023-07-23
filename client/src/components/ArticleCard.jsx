import React from "react";

const ArticleCard = ({ title, description }) => {
  return (
    <div className="flex flex-col gap-4 rounded-lg border-2 border-neutral p-3 bg-white h-105 w-80">
      <div className="bg-blog-pic bg-contain w-full h-1/2 rounded-lg"></div>
      <div className="flex flex-col px-3 gap-3">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default ArticleCard;
