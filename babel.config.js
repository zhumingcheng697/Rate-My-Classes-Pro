const reactNativePreset = "module:metro-react-native-babel-preset";
const expoPreset = "babel-preset-expo";

const isUsingExpoWithNPM =
  process.env &&
  process.env._ &&
  (process.env._.endsWith("/expo") || process.env._.endsWith("/expo-cli"));

const isUsingExpoWithCLI =
  process.argv &&
  process.argv[1] &&
  (process.argv[1].endsWith("/expo") || process.argv[1].endsWith("/expo-cli"));

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      isUsingExpoWithNPM || isUsingExpoWithCLI ? expoPreset : reactNativePreset,
    ],
    plugins: [
      "@babel/plugin-proposal-async-generator-functions",
      [
        "module:react-native-dotenv",
        {
          moduleName: "react-native-dotenv",
        },
      ],
    ],
  };
};
