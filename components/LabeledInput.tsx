import React, { type ReactNode } from "react";
import { Box, type IBoxProps, HStack, Text } from "native-base";

import colors from "../libs/colors";
import { colorModeResponsiveStyle } from "../libs/color-mode-utils";
import theme from "../libs/theme";

type LabeledInputBaseProps = {
  label: string;
  isDisabled?: boolean;
  usePlainLabel?: boolean;
  showRequiredIcon?: boolean;
  input?: ReactNode;
  children?: ReactNode;
};

export type LabeledInputProps = LabeledInputBaseProps &
  Omit<IBoxProps, keyof LabeledInputBaseProps>;

export default function LabeledInput({
  label,
  isDisabled,
  usePlainLabel = false,
  showRequiredIcon = false,
  input,
  children,
  ...rest
}: LabeledInputProps) {
  return (
    <Box {...rest}>
      <HStack opacity={isDisabled ? 0.5 : undefined}>
        <Text
          variant={"label"}
          fontWeight={usePlainLabel ? undefined : "semibold"}
          {...(usePlainLabel
            ? {}
            : colorModeResponsiveStyle((selector) => ({
                color: selector(colors.nyu),
              })))}
        >
          {label ?? "Label"}
        </Text>
        {showRequiredIcon && (
          <Text
            variant={"label"}
            marginLeft={"1px"}
            fontWeight={"bold"}
            {...colorModeResponsiveStyle((selector) => ({
              color: selector({
                light: theme.colors.red[500],
                dark: theme.colors.red[500],
              }),
            }))}
          >
            *
          </Text>
        )}
      </HStack>
      {input ?? children}
    </Box>
  );
}
