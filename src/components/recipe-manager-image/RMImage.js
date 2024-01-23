import React from "react";
import Image from "next/image";

const RMImage = (props) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Image
        src={props?.src}
        sizes="(max-width: 768px) 100vw, 33vw"
        fill
        alt="recipe-manager"
        placeholder="blur"
        {...props}
      ></Image>
    </div>
  );
};

export default RMImage;
