module.exports = {
  root: true,
  extends: "@react-native-community",
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_",
            varsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
          },
        ],
        curly: "off",
        "no-shadow": "off",
        quotes: ["warn", "double", { avoidEscape: true }],
      },
    },
  ],
};
