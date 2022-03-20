import { type ReactText } from "react";
import {
  Pressable,
  type IPressableProps,
  Text,
  type ITextProps,
} from "native-base";

type PlainTextButtonProps = {
  title?: string;
  _text?: ITextProps;
  children?: ReactText;
};

export default function PlainTextButton({
  title,
  _text,
  children,
  ...rest
}: PlainTextButtonProps & Omit<IPressableProps, keyof PlainTextButtonProps>) {
  _text = Object.assign(
    {
      color: "nyu.default",
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
