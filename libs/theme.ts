import { extendTheme, theme } from "native-base";

import colors from "./colors";
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
  ...colorModeResponsiveStyle((selector) => ({
    borderColor: selector({
      light: theme.colors.gray[400],
      dark: theme.colors.gray[600],
    }),
    _focus: {
      borderColor: selector({
        light: theme.colors.gray[400],
        dark: theme.colors.gray[600],
      }),
    },
  })),
  _web: colorModeResponsiveStyle((selector) => ({
    _focus: {
      borderWidth: 2,
      borderColor: selector(colors.nyu),
    },
  })),
};

const componentsStyle = {
  Icon: {
    defaultProps: {
      size: "sm",
      ...colorModeResponsiveStyle((selector) => ({
        color: selector({
          light: theme.colors.gray[400],
          dark: theme.colors.gray[500],
        }),
      })),
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
        ...colorModeResponsiveStyle((selector) => ({
          background: selector(colors.nyu),
        })),
        _text: {
          color: "white",
          ...buttonTextBaseStyle,
        },
      },
      subtle: {
        ...buttonBaseStyle,
        ...colorModeResponsiveStyle((selector) => ({
          background: selector(colors.background.secondary),
          _text: {
            color: selector(colors.nyu),
            ...buttonTextBaseStyle,
          },
        })),
      },
    },
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
  Skeleton: {
    defaultProps: colorModeResponsiveStyle((selector) => ({
      startColor: selector(colors.background.secondary),
      endColor: selector(colors.background.secondaryWithOpacity),
    })),
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
    baseStyle: {
      ...inputSelectBaseStyle,
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
    },
  },
};

export default extendTheme({
  colors,
  components: componentsStyle,
});
