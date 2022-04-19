module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [["transform-inline-environment-variables"]],
};

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: ["babel-preset-expo"],
//     plugins: [["transform-inline-environment-variables"]],
//   };
// };
