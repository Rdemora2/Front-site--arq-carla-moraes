import * as React from "react";
import * as emotionCore from "@emotion/react";
import * as emotionStyled from "@emotion/styled";
import * as styledComponents from "styled-components";

if (typeof window !== "undefined") {
  window.React = React;
}

React.useInsertionEffect = React.useInsertionEffect || React.useLayoutEffect;

export const emotionReact = emotionCore;
export const emotionStyledLib = emotionStyled;
export const styledComponentsLib = styledComponents;
