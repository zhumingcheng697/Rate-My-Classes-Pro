import { extendTheme } from "native-base";

export const inputSelectHeight = 40;

export const colorStyle = {
  background: {
    primary: { light: "#ffffff", dark: "#000000" },
    secondary: { light: "#f2f2f7", dark: "#1c1c1e" },
    tertiary: { light: "#e5e5ea", dark: "#2c2c2e" },
  },
  nyu: { light: "#57068c", dark: "#c05eff" },
};

export const lightColorStyle = {
  background: {
    primary: "#ffffff",
    secondary: "#f2f2f7",
    tertiary: "#e5e5ea",
  },
  nyu: "#57068c",
};

export const darkColorStyle = {
  background: {
    primary: "#000000",
    secondary: "#1c1c1e",
    tertiary: "#2c2c2e",
  },
  nyu: "#c05eff",
};

const colorStyleHelper = (
  style: (
    colorStyle: typeof lightColorStyle | typeof darkColorStyle
  ) => Record<string, any>
) => ({ ...style(lightColorStyle), _dark: style(darkColorStyle) });

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
  _disabled: { opacity: 0.5 },
  _pressed: { opacity: 0.5 },
  _hover: { opacity: 0.7 },
};

const inputSelectBaseStyle = {
  borderRadius: 10,
  height: `${inputSelectHeight}px`,
};

const inputSelectDefaultProps = {
  backgroundColor: "transparent",
  size: "lg",
  borderWidth: 1,
  borderColor: "gray.400",
  _focus: {
    borderColor: "gray.400",
  },
  _dark: {
    borderColor: "gray.600",
    _focus: {
      borderColor: "gray.600",
    },
  },
};

const componentsStyle = {
  Icon: {
    defaultProps: {
      size: "sm",
      color: "gray.400",
      _dark: {
        color: "gray.500",
      },
    },
  },
  Pressable: {
    defaultProps: {
      _disabled: {
        opacity: 0.5,
      },
    },
  },
  IconButton: {
    defaultProps: {
      _pressed: { _icon: { opacity: 0.5 } },
      _hover: { _icon: { opacity: 0.7 } },
    },
  },
  Button: {
    variants: {
      solid: {
        ...buttonBaseStyle,
        ...colorStyleHelper((colorStyle) => ({ background: colorStyle.nyu })),
        _text: {
          color: "white",
          ...buttonTextBaseStyle,
        },
      },
      subtle: {
        ...buttonBaseStyle,
        ...colorStyleHelper((colorStyle) => ({
          background: colorStyle.background.secondary,
          _text: {
            color: colorStyle.nyu,
            ...buttonTextBaseStyle,
          },
        })),
      },
    },
  },
  Skeleton: {
    defaultProps: {
      ...colorStyleHelper((colorStyle) => ({
        startColor: colorStyle.background.secondary,
        endColor: colorStyle.background.secondary + "77",
      })),
    },
  },
  ScrollView: {
    defaultProps: {
      keyboardShouldPersistTaps: "handled",
      ...colorStyleHelper((colorStyle) => ({
        background: colorStyle.background.primary,
      })),
    },
    baseStyle: {
      minHeight: "100%",
    },
  },
  Input: {
    defaultProps: {
      enablesReturnKeyAutomatically: true,
      ...inputSelectDefaultProps,
    },
    baseStyle: {
      ...inputSelectBaseStyle,
    },
    variants: {
      password: {
        secureTextEntry: true,
        autoComplete: "off",
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
        ...colorStyleHelper((colorStyle) => ({
          _pressed: { background: colorStyle.background.tertiary },
          _hover: { background: colorStyle.background.tertiary + "77" },
        })),
      },
      _selectedItem: {
        _text: {
          fontWeight: "semibold",
          ...colorStyleHelper((colorStyle) => ({ color: colorStyle.nyu })),
        },
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
        color: "#ffffff",
        ...buttonTextBaseStyle,
      },
      subtleButton: {
        ...colorStyleHelper((colorStyle) => ({ color: colorStyle.nyu })),
        ...buttonTextBaseStyle,
      },
    },
  },
};

export default extendTheme({
  config: { useSystemColorMode: true },
  colors: colorStyle,
  components: componentsStyle,
});
