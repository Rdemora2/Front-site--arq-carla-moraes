module.exports = {
  twin: {
    styled: "styled-components",
    config: "./src/tailwind.config.js",
    format: "auto",
    includeClassNames: process.env.NODE_ENV === "development",
    // Melhorar sourcemap para desenvolvimento
    debug: process.env.NODE_ENV === "development",
    disableColorVariables: false,
  },
};
