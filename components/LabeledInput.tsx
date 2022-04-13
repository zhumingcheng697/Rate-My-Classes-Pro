import React, { type ReactNode } from "react";
import { Box, type IBoxProps, HStack, Text } from "native-base";

type LabeledInputBaseProps = {
  label: string;
  usePlainLabel?: boolean;
  showRequiredIcon?: boolean;
  input?: ReactNode;
  children?: ReactNode;
};

export type LabeledInputProps = LabeledInputBaseProps &
  Omit<IBoxProps, keyof LabeledInputBaseProps>;

export default function LabeledInput({
  label,
  usePlainLabel = false,
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
          fontWeight={usePlainLabel ? undefined : "semibold"}
          color={usePlainLabel ? undefined : "nyu"}
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
