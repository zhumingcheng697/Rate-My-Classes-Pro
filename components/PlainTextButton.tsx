import React, { type ReactText } from "react";
import { type IPressableProps, Text, type ITextProps } from "native-base";

import colors from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import { pressableBaseStyle } from "../styling/theme";
import { Pressable, type LinkTo } from "./LinkCompatibleButtons";

type PlainTextButtonBaseProps = {
  title?: string;
  _text?: ITextProps;
  children?: ReactText;
} & LinkTo;

export type PlainTextButtonProps = PlainTextButtonBaseProps &
  Omit<IPressableProps, keyof PlainTextButtonBaseProps>;

export default function PlainTextButton({
  title,
  _text,
  children,
  ...rest
}: PlainTextButtonProps) {
  _text = Object.assign(
    {
      fontWeight: "semibold",
      textAlign: "center",
      ...colorModeResponsiveStyle((selector) => ({
        color: selector(colors.nyu),
      })),
    },
    _text
  );

  return (
    <Pressable {...pressableBaseStyle} {...rest}>
      <Text {..._text}>{title ?? children ?? "Button"}</Text>
    </Pressable>
  );
}
