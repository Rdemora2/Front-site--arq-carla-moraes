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
    "css",
    "as",
  ];

  return (
    !customProps.includes(prop) &&
    prop !== "theme" &&
    !prop.startsWith("$") &&
    !prop.startsWith("__")
  );
};

export const StyledComponentsProvider = ({ children }) => (
  <StyleSheetManager
    shouldForwardProp={shouldForwardProp}
    enableVendorPrefixes={true}
    disableVendorPrefixes={false}
  >
    {children}
  </StyleSheetManager>
);
