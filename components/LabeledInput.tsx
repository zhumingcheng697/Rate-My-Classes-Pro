import React, { type ReactNode } from "react";
import { Box, type IBoxProps, HStack, Text } from "native-base";

type LabeledInputBaseProps = {
  label: string;
  useBoldLabel: boolean;
  showRequiredIcon?: boolean;
  input?: ReactNode;
  children?: ReactNode;
};

export type LabeledInputProps = LabeledInputBaseProps &
  Omit<IBoxProps, keyof LabeledInputBaseProps>;

export default function LabeledInput({
  label,
  useBoldLabel,
  showRequiredIcon = false,
  input,
  children,
  ...rest
}: LabeledInputProps) {
  return (
    <Box {...rest}>
      <HStack>
        <Text
          variant={"label"}
          fontWeight={useBoldLabel ? "semibold" : undefined}
          color={useBoldLabel ? "nyu" : undefined}
        >
          {label ?? "Label"}
        </Text>
        {showRequiredIcon && (
          <Text
            variant={"label"}
            marginLeft={"1px"}
            fontWeight={"bold"}
            color={"red.500"}
          >
            *
          </Text>
        )}
      </HStack>
      {input ?? children}
    </Box>
  );
}
