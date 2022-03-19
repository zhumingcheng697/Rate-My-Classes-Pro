import { extendTheme } from "native-base";

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

export const colorStyle = {
  background: {
    primary: "#ffffff",
    secondary: "#f2f2f7",
    tertiary: "#e5e5ea",
  },
  nyu: {
    default: "#57068c",
  },
};

const componentsStyle = {
  Skeleton: {
    baseStyle: {
      startColor: colorStyle.background.secondary,
      endColor: colorStyle.background.secondary + "77",
    },
  },
  ScrollView: {
    baseStyle: {
      background: colorStyle.background.primary,
      minHeight: "100%",
    },
  },
  Input: {
    defaultProps: {
      size: "lg",
      borderWidth: 1.5,
      _focus: {
        borderColor: "nyu.default",
      },
    },
    baseStyle: {
      borderRadius: 10,
      borderColor: "gray.400",
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
