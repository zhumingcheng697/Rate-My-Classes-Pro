import React, { type ReactText } from "react";
import {
  Pressable,
  type IPressableProps,
  Text,
  type ITextProps,
} from "native-base";

type PlainTextButtonBaseProps = {
  title?: string;
  _text?: ITextProps;
  children?: ReactText;
};

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
      color: "nyu.light",
      _dark: { color: "nyu.dark" },
      fontWeight: "semibold",
      textAlign: "center",
    },
    _text
  );

  return (
    <Pressable {...rest}>
      <Text {..._text}>{title ?? children ?? "Button"}</Text>
    </Pressable>
  );
}
