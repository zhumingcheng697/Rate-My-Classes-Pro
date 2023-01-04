import { extendTheme, theme } from "native-base";

import colors, { solidBorder, subtleBorder } from "./colors";
import { colorModeResponsiveStyle } from "./color-mode-utils";

export const inputSelectHeight = 40;

export const textColorStyle = colorModeResponsiveStyle((selector) => ({
  color: selector({
    light: theme.colors.darkText,
    dark: theme.colors.lightText,
  }),
}));

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
  _web: { userSelect: "none" },
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
  ...textColorStyle,
};

const inputSelectDefaultProps = {
  backgroundColor: "transparent",
  size: "lg",
  borderWidth: 1,
  padding: "8px",
  borderColor: solidBorder,
  ...colorModeResponsiveStyle((selector) => ({
    selectionColor: selector(colors.nyu),
  })),
  focusOutlineColor: solidBorder,
  _focus: {
    borderColor: solidBorder,
  },
  _hover: {
    borderColor: solidBorder,
    _disabled: {
      borderColor: solidBorder,
    },
  },
  _web: colorModeResponsiveStyle((selector) => ({
    focusOutlineColor: selector(colors.nyu),
    _focus: {
      borderColor: selector(colors.nyu),
      _hover: {
        borderColor: selector(colors.nyu),
      },
      _stack: {
        style: {
          boxShadow: "0 0 0 1px " + selector(colors.nyu),
        },
      },
      _disabled: {
        focusOutlineColor: solidBorder,
      },
    },
  })),
};

export const solidButtonStyle = {
  ...buttonBaseStyle,
  ...colorModeResponsiveStyle((selector) => ({
    background: selector(colors.nyu),
  })),
  _text: {
    color: "#ffffff",
    ...buttonTextBaseStyle,
  },
};

export const dangerousSolidButtonStyle = {
  ...buttonBaseStyle,
  ...colorModeResponsiveStyle((selector) => ({
    background: selector({
      light: theme.colors.red[600],
      dark: theme.colors.red[500],
    }),
  })),
  _text: {
    color: "#ffffff",
    ...buttonTextBaseStyle,
  },
};

export const subtleButtonStyle = {
  ...buttonBaseStyle,
  ...colorModeResponsiveStyle((selector) => ({
    background: selector(colors.background.secondary),
    _text: {
      color: selector(colors.nyu),
      ...buttonTextBaseStyle,
    },
  })),
};

const componentsStyle = {
  Button: {
    variants: {
      solid: solidButtonStyle,
      subtle: subtleButtonStyle,
      dangerous: dangerousSolidButtonStyle,
    },
  },
  Divider: {
    baseStyle: {
      background: subtleBorder,
      height: "1px",
    },
  },
  Icon: {
    defaultProps: {
      size: "sm",
      color: solidBorder,
      _web: {
        userSelect: "none",
        "aria-hidden": "true",
      },
    },
  },
  IconButton: {
    defaultProps: {
      ...pressableBaseStyle,
    },
  },
  Input: {
    defaultProps: {
      maxLength: 50,
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
      _disabled: {
        opacity: 1,
      },
      _actionSheetContent: {
        padding: "10px",
        ...colorModeResponsiveStyle((selector) => ({
          background: selector({
            light: theme.colors.white,
            dark: theme.colors.gray[700],
          }),
        })),
      },
      _item: {
        marginX: "0px",
        marginY: "2px",
        padding: "10px",
        borderRadius: 10,
        background: "transparent",
        _text: textColorStyle,
        ...colorModeResponsiveStyle((selector) => ({
          _pressed: { background: selector(colors.background.tertiary) },
          _hover: {
            background: selector(colors.background.tertiaryWithOpacity),
          },
        })),
      },
      _selectedItem: {
        _text: {
          fontWeight: "semibold",
          ...colorModeResponsiveStyle((selector) => ({
            color: selector(colors.nyu),
          })),
        },
      },
    },
    baseStyle: inputSelectBaseStyle,
  },
  ScrollView: {
    defaultProps: {
      keyboardShouldPersistTaps: "handled",
      ...colorModeResponsiveStyle((selector) => ({
        background: selector(colors.background.primary),
      })),
    },
    baseStyle: {
      minHeight: "100%",
    },
  },
  Skeleton: {
    defaultProps: colorModeResponsiveStyle((selector) => ({
      startColor: selector(colors.background.secondary),
      endColor: selector(colors.background.secondaryWithOpacity),
    })),
  },
  Switch: {
    baseStyle: {
      onThumbColor: "#ffffff",
      offThumbColor: "#ffffff",
      ...colorModeResponsiveStyle((selector) => ({
        onTrackColor: selector(colors.nyu),
      })),
    },
  },
  Text: {
    baseStyle: {
      fontSize: 15,
      ...textColorStyle,
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
      dangerousLabel: {
        marginBottom: "2px",
        ...colorModeResponsiveStyle((selector) => ({
          color: selector({
            light: theme.colors.red[600],
            dark: theme.colors.red[500],
          }),
        })),
      },
      button: {
        color: "#ffffff",
        ...buttonTextBaseStyle,
      },
      subtleButton: {
        ...colorModeResponsiveStyle((selector) => ({
          color: selector(colors.nyu),
        })),
        ...buttonTextBaseStyle,
      },
      dangerousSubtleButton: {
        ...colorModeResponsiveStyle((selector) => ({
          color: selector({
            light: theme.colors.red[600],
            dark: theme.colors.red[500],
          }),
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
