import {
  Pressable,
  type IPressableProps,
  Text,
  type ITextProps,
} from "native-base";

type PlainTextButtonProps = {
  title: string;
  _text?: ITextProps;
};

export default function PlainTextButton({
  title,
  _text,
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
          {title}
        </Text>
      )}
    </Pressable>
  );
}
