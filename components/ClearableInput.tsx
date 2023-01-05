import React, { useEffect, useState } from "react";
import { Platform, type ReturnKeyTypeOptions } from "react-native";
import { Input, Icon, type IInputProps, Box } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import { IconButton } from "./LinkCompatibleButton";

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
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    if (Platform.OS === "web")
      window.addEventListener("mouseup", () => setIsMouseDown(false));
  }, []);

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
              as={<Ionicons name={"search"} />}
            />
          )}
        </Box>
      }
      rightElement={
        <Box>
          {(canClear ?? !!value) && (
            <IconButton
              padding={"3px"}
              marginRight={"2px"}
              icon={
                <Icon size={"22px"} as={<Ionicons name={"close-circle"} />} />
              }
              onPress={() => onChangeText("")}
              _web={{
                // @ts-ignore
                onMouseUp: (e: MouseEvent) => {
                  if (!e.button && isMouseDown) onChangeText("");
                },
                onMouseDown: (e: MouseEvent) => {
                  if (!e.button) setIsMouseDown(true);
                },
              }}
            />
          )}
        </Box>
      }
    />
  );
}
