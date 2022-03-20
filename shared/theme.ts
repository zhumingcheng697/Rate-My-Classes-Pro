import { extendTheme } from "native-base";

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

const buttonTextBaseStyle = {
  fontWeight: "semibold",
  fontSize: "md",
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
        _text: {
          color: "white",
        },
        _pressed: {
          opacity: 0.5,
        },
        _hover: {
          opacity: 0.5,
        },
      },
      subtle: {
        borderRadius: 10,
        background: colorStyle.background.secondary,
        _text: {
          color: colorStyle.nyu.default,
        },
        _pressed: {
          background: colorStyle.background.tertiary,
        },
        _hover: {
          background: colorStyle.background.tertiary,
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
    baseStyle: {
      fontSize: 15,
    },
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
        marginBottom: "2px",
      },
      button: {
        color: "white",
        ...buttonTextBaseStyle,
      },
      subtleButton: {
        color: colorStyle.nyu.default,
        ...buttonTextBaseStyle,
      },
    },
  },
};

export default extendTheme({
  colors: colorStyle,
  components: componentsStyle,
});
