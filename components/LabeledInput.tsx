import React, { type ReactNode } from "react";
import {
  Box,
  type IBoxProps,
  HStack,
  type IStackProps,
  Text,
} from "native-base";

type LabeledInputBaseProps = {
  label: string;
  _label?: IStackProps;
  usePlainLabel?: boolean;
  showRequiredIcon?: boolean;
  input?: ReactNode;
  children?: ReactNode;
};

export type LabeledInputProps = LabeledInputBaseProps &
  Omit<IBoxProps, keyof LabeledInputBaseProps>;

export default function LabeledInput({
  label,
  _label,
  usePlainLabel = false,
  showRequiredIcon = false,
  input,
  children,
  ...rest
}: LabeledInputProps) {
  return (
    <Box {...rest}>
      <HStack {..._label}>
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
