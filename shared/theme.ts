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
  Button: {
    variants: {
      solid: {
        borderRadius: 10,
        background: colorStyle.nyu.default,
        _pressed: {
          opacity: 0.5,
        },
        _hover: {
          opacity: 0.5,
        },
      },
    },
  },
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
      borderWidth: 1,
      _focus: {
        borderColor: "gray.400",
      },
    },
    baseStyle: {
      borderRadius: 10,
      borderColor: "gray.400",
    },
    variants: {
      password: {
        type: "password",
        keyboardType: "visible-password",
        autoCapitalize: "none",
        autoCorrect: false,
      },
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
      label: {
        fontSize: 15,
        marginBottom: "2px",
      },
    },
  },
};

export default extendTheme({
  colors: colorStyle,
  components: componentsStyle,
});
