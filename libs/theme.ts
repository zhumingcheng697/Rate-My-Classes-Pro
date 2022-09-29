import { extendTheme } from "native-base";

import colors from "./colors";
import { themeColorStyleHelper } from "./color-mode-utils";

export const inputSelectHeight = 40;

export const colorStyle = {
  background: {
    primary: { light: "#ffffff", dark: "#000000" },
    secondary: { light: "#f2f2f7", dark: "#1c1c1e" },
    secondaryWithOpacity: { light: "#f2f2f777", dark: "#1c1c1e77" },
    tertiary: { light: "#e5e5ea", dark: "#2c2c2e" },
    tertiaryWithOpacity: { light: "#e5e5ea77", dark: "#2c2c2e77" },
  },
  nyu: { light: "#57068c", dark: "#c05eff" },
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

export const pressableBaseStyle = {
  _disabled: { opacity: 0.5 },
  _pressed: { opacity: 0.5 },
  _hover: { opacity: 0.72 },
};

export const buttonBaseStyle = {
  paddingX: "12px",
  paddingY: "8px",
  borderRadius: 10,
  ...pressableBaseStyle,
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
  _web: {
    ...themeColorStyleHelper((colorStyle, mapper) => ({
      _focus: {
        borderWidth: 2,
        borderColor: mapper(colorStyle.nyu),
      },
    })),
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
  IconButton: {
    defaultProps: {
      ...pressableBaseStyle,
    },
  },
  Button: {
    variants: {
      solid: {
        ...buttonBaseStyle,
        ...themeColorStyleHelper((colorStyle, mapper) => ({
          background: mapper(colorStyle.nyu),
        })),
        _text: {
          color: "white",
          ...buttonTextBaseStyle,
        },
      },
      subtle: {
        ...buttonBaseStyle,
        ...themeColorStyleHelper((colorStyle, mapper) => ({
          background: mapper(colorStyle.background.secondary),
          _text: {
            color: mapper(colorStyle.nyu),
            ...buttonTextBaseStyle,
          },
        })),
      },
    },
  },
  Skeleton: {
    defaultProps: {
      ...themeColorStyleHelper((colorStyle, mapper) => ({
        startColor: mapper(colorStyle.background.secondary),
        endColor: mapper(colorStyle.background.secondaryWithOpacity),
      })),
    },
  },
  ScrollView: {
    defaultProps: {
      keyboardShouldPersistTaps: "handled",
      ...themeColorStyleHelper((colorStyle, mapper) => ({
        background: mapper(colorStyle.background.primary),
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
        ...themeColorStyleHelper((colorStyle, mapper) => ({
          _pressed: { background: mapper(colorStyle.background.tertiary) },
          _hover: {
            background: mapper(colorStyle.background.tertiaryWithOpacity),
          },
        })),
      },
      _selectedItem: {
        _text: {
          fontWeight: "semibold",
          ...themeColorStyleHelper((colorStyle, mapper) => ({
            color: mapper(colorStyle.nyu),
          })),
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
        ...themeColorStyleHelper((colorStyle, mapper) => ({
          color: mapper(colorStyle.nyu),
        })),
        ...buttonTextBaseStyle,
      },
    },
  },
};

export default extendTheme({
  colors,
  components: componentsStyle,
});
