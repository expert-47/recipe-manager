import { getImageUrl } from "@/utils/getImageUrl";
import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const spanStyle = {
  padding: "20px",
  background: "#efefef",
  color: "#000000",
};

const divStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundSize: "cover",
  height: "400px",
};

const ImageSlider = (props) => {
  const { imagesUrl } = props;

  return (
    <div className="slide-container">
      <Slide>
        {imagesUrl.map((item, index) => {
          return (
            <div key={index}>
              <div
                style={{
                  ...divStyle,
                  backgroundImage: `url(${getImageUrl(item?.attributes?.url)})`,
                }}
              ></div>
            </div>
          );
        })}
      </Slide>
    </div>
  );
};

export default ImageSlider;
