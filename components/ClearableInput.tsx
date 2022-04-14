import React from "react";
import { type ReturnKeyTypeOptions } from "react-native";
import { Input, IconButton, Icon, type IInputProps, Box } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type ClearableInputBaseProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  isSearchBar?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  canClear?: boolean;
};

export type ClearableInputProps = ClearableInputBaseProps &
  Omit<IInputProps, keyof ClearableInputBaseProps>;

export default function ClearableInput({
  value,
  onChangeText,
  placeholder,
  isSearchBar = false,
  returnKeyType,
  canClear,
  ...rest
}: ClearableInputProps) {
  return (
    <Input
      {...rest}
      px={isSearchBar ? "3px" : undefined}
      placeholder={placeholder ?? (isSearchBar ? "Search" : undefined)}
      value={value}
      onChangeText={onChangeText}
      returnKeyType={returnKeyType ?? (isSearchBar ? "search" : undefined)}
      leftElement={
        <Box>
          {isSearchBar && (
            <Icon
              marginLeft={"5px"}
              size={"22px"}
              color={"gray.400"}
              as={<Ionicons name={"search"} />}
            />
          )}
        </Box>
      }
      rightElement={
        <Box>
          {(canClear ?? value) && (
            <IconButton
              variant={"unstyled"}
              padding={"3px"}
              marginRight={"2px"}
              icon={
                <Icon
                  size={"22px"}
                  color={"gray.400"}
                  as={<Ionicons name={"close-circle"} />}
                />
              }
              onPress={() => {
                onChangeText("");
              }}
            />
          )}
        </Box>
      }
    />
  );
}
