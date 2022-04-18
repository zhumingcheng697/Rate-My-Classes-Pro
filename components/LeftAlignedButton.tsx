import React, { type ReactText } from "react";
import {
  Flex,
  Icon,
  Pressable,
  type IPressableProps,
  Text,
  type ITextProps,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { buttonBaseStyle } from "../libs/theme";

type LeftAlignedButtonBaseProps = {
  title?: string;
  _text?: ITextProps;
  showChevron?: boolean;
  children?: ReactText;
};

export type LeftAlignedButtonProps = LeftAlignedButtonBaseProps &
  Omit<IPressableProps, keyof LeftAlignedButtonBaseProps>;

export default function LeftAlignedButton({
  title,
  _text,
  showChevron = true,
  children,
  ...rest
}: LeftAlignedButtonProps) {
  return (
    <Pressable {...rest}>
      {({ isPressed, isHovered }) => (
        <Flex
          {...buttonBaseStyle}
          justifyContent={"space-between"}
          flexDirection={"row"}
          alignItems={"center"}
          alignContent={"center"}
          opacity={isPressed ? 0.5 : isHovered ? 0.72 : 1}
          background={"background.secondary.light"}
          _dark={{ background: "background.secondary.dark" }}
        >
          <Text {..._text} variant={"subtleButton"}>
            {title ?? children ?? "Button"}
          </Text>
          {showChevron && (
            <Icon
              marginRight={"-5px"}
              size={"18px"}
              as={<Ionicons name={"chevron-forward"} />}
            />
          )}
        </Flex>
      )}
    </Pressable>
  );
}
