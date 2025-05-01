module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  plugins: ["react", "react-hooks"],
  rules: {
    // Regras personalizadas para o projeto
    "react/prop-types": "off", // Se não estiver usando PropTypes
    "react/react-in-jsx-scope": "off", // Para React 17+
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
