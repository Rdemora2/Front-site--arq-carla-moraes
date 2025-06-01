module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  plugins: ["react", "react-hooks", "jsx-a11y"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // PropTypes
    "react/prop-types": "error",
    "react/require-default-props": "warn",
    
    // React Rules
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-pascal-case": "error",
    "react/no-array-index-key": "warn",
    "react/no-danger": "warn",
    "react/no-deprecated": "error",
    "react/no-direct-mutation-state": "error",
    "react/no-find-dom-node": "error",
    "react/no-is-mounted": "error",
    "react/no-render-return-value": "error",
    "react/no-string-refs": "error",
    "react/no-unescaped-entities": "error",
    "react/no-unknown-property": "error",
    "react/no-unsafe": "error",
    "react/prefer-es6-class": "error",
    "react/self-closing-comp": "error",
    "react/sort-comp": "warn",
    
    // React Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    
    // JavaScript Rules
    "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "no-var": "error",
    "prefer-const": "error",
    "prefer-arrow-callback": "error",
    "arrow-spacing": "error",
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    "quotes": ["error", "double", { allowTemplateLiterals: true }],
    "object-shorthand": "error",
    "prefer-template": "error",
    
    // Accessibility
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-has-content": "error",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-proptypes": "error",
    "jsx-a11y/aria-unsupported-elements": "error",
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/heading-has-content": "error",
    "jsx-a11y/img-redundant-alt": "error",
    "jsx-a11y/interactive-supports-focus": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-access-key": "error",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-distracting-elements": "error",
    "jsx-a11y/no-redundant-roles": "error",
    "jsx-a11y/role-has-required-aria-props": "error",
    "jsx-a11y/role-supports-aria-props": "error",
    "jsx-a11y/tabindex-no-positive": "error",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["*.test.js", "*.test.jsx", "*.spec.js", "*.spec.jsx"],
      env: {
        jest: true,
      },
      rules: {
        "no-console": "off",
      },
    },
  ],
};
