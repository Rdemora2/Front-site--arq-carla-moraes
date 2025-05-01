import React from "react";
import { StyleSheetManager } from "styled-components";

const shouldForwardProp = (prop) => {
  const customProps = [
    "imageSrc",
    "textOnLeft",
    "imageContain",
    "imageShadow",
    "primaryBackground",
    "imageDecoratorBlob",
    "imageDecoratorBlobCss",
    "imageCss",
    "imageInsideDiv",
  ];

  return (
    !customProps.includes(prop) && prop !== "theme" && !prop.startsWith("$")
  );
};

export const StyledComponentsProvider = ({ children }) => (
  <StyleSheetManager shouldForwardProp={shouldForwardProp}>
    {children}
  </StyleSheetManager>
);
