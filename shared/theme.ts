import { extendTheme } from "native-base";

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

const headerBaseStyle = {
  lineHeight: "1.05em",
  marginX: "10px",
  marginY: "3px",
};

const buttonTextBaseStyle = {
  textAlign: "center",
  fontWeight: "semibold",
  fontSize: "md",
};

export const buttonBaseStyle = {
  paddingX: "12px",
  paddingY: "8px",
  borderRadius: 10,
};

const inputSelectBaseStyle = { borderRadius: 10, borderColor: "gray.400" };

const inputSelectDefaultProps = {
  backgroundColor: "transparent",
  size: "lg",
  borderWidth: 1,
  _focus: {
    borderColor: "gray.400",
  },
};

const componentsStyle = {
  Icon: {
    defaultProps: {
      size: "sm",
      color: "gray.400",
    },
  },
  Button: {
    variants: {
      solid: {
        ...buttonBaseStyle,
        background: colorStyle.nyu.default,
        _text: {
          color: "white",
          ...buttonTextBaseStyle,
        },
        _pressed: {
          opacity: 0.5,
        },
        _hover: {
          opacity: 0.5,
        },
      },
      subtle: {
        ...buttonBaseStyle,
        background: colorStyle.background.secondary,
        _text: {
          color: colorStyle.nyu.default,
          ...buttonTextBaseStyle,
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
    defaultProps: {
      keyboardShouldPersistTaps: "handled",
    },
    baseStyle: {
      background: colorStyle.background.primary,
      minHeight: "100%",
    },
  },
  Input: {
    defaultProps: {
      ...inputSelectDefaultProps,
    },
    baseStyle: {
      ...inputSelectBaseStyle,
    },
    variants: {
      password: {
        type: "password",
        autoCapitalize: "none",
        autoCorrect: false,
      },
    },
  },
  Select: {
    defaultProps: {
      ...inputSelectDefaultProps,
      _actionSheetContent: {
        padding: "10px",
      },
      _item: {
        marginX: "0px",
        marginY: "2px",
        padding: "10px",
        borderRadius: 10,
      },
      _selectedItem: {
        _text: { fontWeight: "semibold", color: "nyu.default" },
      },
    },
    baseStyle: {
      ...inputSelectBaseStyle,
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
