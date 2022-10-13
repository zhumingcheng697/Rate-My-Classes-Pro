import React from "react";
import { Text, type IButtonProps } from "native-base";

import { SubtleButton, type LinkTo } from "./LinkCompatibleButtons";

type TieredTextButtonBaseProps = {
  primaryText: string;
  secondaryText?: string;
} & LinkTo;

export type TieredTextButtonProps = TieredTextButtonBaseProps &
  Omit<IButtonProps, keyof TieredTextButtonBaseProps>;

export default function TieredTextButton({
  primaryText,
  secondaryText,
  ...rest
}: TieredTextButtonProps) {
  const { width } = rest;

  return (
    <SubtleButton {...rest}>
      <Text
        width={width}
        paddingX={"8px"}
        variant={"subtleButton"}
        fontWeight={"medium"}
        lineHeight={"sm"}
        numberOfLines={2}
      >
        {primaryText}
      </Text>
      {!!secondaryText && (
        <Text
          width={width}
          paddingX={"8px"}
          fontSize={"sm"}
          textAlign={"center"}
          numberOfLines={2}
        >
          {secondaryText}
        </Text>
      )}
    </SubtleButton>
  );
}
