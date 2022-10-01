const colors = {
  background: {
    primary: { light: "#ffffff", dark: "#000000" },
    secondary: { light: "#f2f2f7", dark: "#1c1c1e" },
    secondaryWithOpacity: { light: "#f2f2f777", dark: "#1c1c1eaa" },
    tertiary: { light: "#e5e5ea", dark: "#2c2c2e" },
    tertiaryWithOpacity: { light: "#e5e5ea77", dark: "#2c2c2eaa" },
  },
  nyu: { light: "#57068c", dark: "#c05eff" },
};

export default colors;

export type Colors = typeof colors;

export type ColorPair = { light: string; dark: string };
