import React from "react";
import { Input, IconButton, Icon, type IInputProps } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type SearchBarBaseProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export type SearchBarProps = SearchBarBaseProps &
  Omit<IInputProps, keyof SearchBarBaseProps>;

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  ...rest
}: SearchBarProps) {
  const pressedHoverStyle = { _icon: { color: "gray.300" } };

  return (
    <Input
      {...rest}
      px={"3px"}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      enablesReturnKeyAutomatically={true}
      returnKeyType={"search"}
      leftElement={
        <Icon
          marginLeft={"5px"}
          size={"22px"}
          color={"gray.400"}
          as={<Ionicons name={"search"} />}
        />
      }
      rightElement={
        value ? (
          <IconButton
            color={"gray.400"}
            variant={"unstyled"}
            _pressed={pressedHoverStyle}
            _hover={pressedHoverStyle}
            padding={"5px"}
            icon={
              <Icon size={"22px"} as={<Ionicons name={"close-circle"} />} />
            }
            onPress={() => {
              onChangeText("");
            }}
          />
        ) : undefined
      }
    />
  );
}
