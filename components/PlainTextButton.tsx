import React, { type ReactText } from "react";
import {
  Pressable,
  type IPressableProps,
  Text,
  type ITextProps,
} from "native-base";
import { useColorScheme } from "react-native";

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
  const colorScheme = useColorScheme();

  _text = Object.assign(
    {
      color: colorScheme === "dark" ? "nyu.dark" : "nyu.light",
      fontWeight: "medium",
      textAlign: "center",
    },
    _text
  );

  return (
    <Pressable {...rest}>
      {({ isPressed, isHovered }) => (
        <Text {..._text} opacity={isPressed || isHovered ? 0.5 : 1}>
          {title ?? children ?? "Button"}
        </Text>
      )}
    </Pressable>
  );
}
