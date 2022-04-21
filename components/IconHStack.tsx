import React, { type ReactNode } from "react";
import { HStack, Icon, type IStackProps, Text } from "native-base";
import { type InterfaceIconProps } from "native-base/lib/typescript/components/primitives/Icon/types";
import Ionicons from "react-native-vector-icons/Ionicons";

type IconHStackBaseProps = {
  iconName: string;
  text?: string;
  children?: ReactNode;
  iconPosition?: "left" | "right";
  _icon?: InterfaceIconProps;
};

export type IconHStackProps = IconHStackBaseProps &
  Omit<IStackProps, keyof IconHStackBaseProps>;

export default function IconHStack({
  iconName,
  text,
  children,
  _icon,
  iconPosition = "left",
  ...rest
}: IconHStackProps) {
  _icon = Object.assign(
    {
      marginTop: "3px",
      size: "xs",
      color: "nyu.light",
      _dark: { color: "nyu.dark" },
    },
    _icon
  );

  let icon = <Icon {..._icon} as={<Ionicons name={iconName} />} />;

  return (
    <HStack {...rest} alignItems={"flex-start"} space={"6px"}>
      {iconPosition === "left" && icon}
      {children ? (
        children
      ) : (
        <Text fontSize={"md"} flexShrink={1} flexGrow={1} lineHeight={"sm"}>
          {text || "Text"}
        </Text>
      )}
      {iconPosition === "right" && icon}
    </HStack>
  );
}
