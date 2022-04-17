import React, { type ReactNode } from "react";
import { HStack, Icon, type IStackProps, Text } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type IconHStackBaseProps = {
  iconName: string;
  text?: string;
  children?: ReactNode;
};

export type IconHStackProps = IconHStackBaseProps &
  Omit<IStackProps, keyof IconHStackBaseProps>;

export default function IconHStack({
  iconName,
  text,
  children,
  ...rest
}: IconHStackProps) {
  return (
    <HStack {...rest} alignItems={"flex-start"} space={"6px"}>
      <Icon
        marginTop={"3px"}
        size={"xs"}
        color={"nyu"}
        as={<Ionicons name={iconName} />}
      />
      {children ? (
        children
      ) : (
        <Text fontSize={"md"} flexShrink={1} flexGrow={1} lineHeight={"sm"}>
          {text || "Text"}
        </Text>
      )}
    </HStack>
  );
}
