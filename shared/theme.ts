import { extendTheme } from "native-base";

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

const colorStyle = {
  background: {
    primary: "#ffffff",
    secondary: "#f2f2f7",
    tertiary: "#e5e5ea",
  },
};

const componentsStyle = {
  Skeleton: {
    baseStyle: {
      startColor: colorStyle.background.primary,
      endColor: colorStyle.background.secondary,
    },
  },
  ScrollView: {
    baseStyle: {
      background: colorStyle.background.primary,
      minHeight: "100%",
    },
  },
  Text: {
    variants: {
      h1: {
        fontWeight: "bold",
        fontSize: "3xl",
        ...headerBaseStyle,
      },
      h2: {
        fontWeight: "semibold",
        fontSize: "2xl",
        ...headerBaseStyle,
      },
    },
  },
};

export default extendTheme({
  colors: colorStyle,
  components: componentsStyle,
});
