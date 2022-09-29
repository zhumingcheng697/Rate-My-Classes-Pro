import { extendTheme } from "native-base";

import colors from "./colors";
import { themeColorStyleHelper } from "./color-mode-utils";

export const inputSelectHeight = 40;

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
    ...themeColorStyleHelper((colors, mapper) => ({
      _focus: {
        borderWidth: 2,
        borderColor: mapper(colors.nyu),
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
        ...themeColorStyleHelper((colors, mapper) => ({
          background: mapper(colors.nyu),
        })),
        _text: {
          color: "white",
          ...buttonTextBaseStyle,
        },
      },
      subtle: {
        ...buttonBaseStyle,
        ...themeColorStyleHelper((colors, mapper) => ({
          background: mapper(colors.background.secondary),
          _text: {
            color: mapper(colors.nyu),
            ...buttonTextBaseStyle,
          },
        })),
      },
    },
  },
  Skeleton: {
    defaultProps: {
      ...themeColorStyleHelper((colors, mapper) => ({
        startColor: mapper(colors.background.secondary),
        endColor: mapper(colors.background.secondaryWithOpacity),
      })),
    },
  },
  ScrollView: {
    defaultProps: {
      keyboardShouldPersistTaps: "handled",
      ...themeColorStyleHelper((colors, mapper) => ({
        background: mapper(colors.background.primary),
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
        ...themeColorStyleHelper((colors, mapper) => ({
          _pressed: { background: mapper(colors.background.tertiary) },
          _hover: {
            background: mapper(colors.background.tertiaryWithOpacity),
          },
        })),
      },
      _selectedItem: {
        _text: {
          fontWeight: "semibold",
          ...themeColorStyleHelper((colors, mapper) => ({
            color: mapper(colors.nyu),
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
        ...themeColorStyleHelper((colors, mapper) => ({
          color: mapper(colors.nyu),
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
