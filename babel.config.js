const isUsingExpoWithNPM =
  process.env &&
  process.env._ &&
  (process.env._.endsWith("/expo") || process.env._.endsWith("/expo-cli"));

const isUsingExpoWithCLI =
  process.argv &&
  process.argv[1] &&
  (process.argv[1].endsWith("/expo") || process.argv[1].endsWith("/expo-cli"));

const reactNativeConfig = function (api) {
  api.cache(true);
  return {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [["transform-inline-environment-variables"]],
  };
};

const expoConfig = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [["transform-inline-environment-variables"]],
  };
};

module.exports =
  isUsingExpoWithNPM || isUsingExpoWithCLI ? expoConfig : reactNativeConfig;
