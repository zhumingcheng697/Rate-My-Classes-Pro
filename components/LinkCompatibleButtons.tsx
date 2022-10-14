import React, { type ReactNode, useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  Button,
  type IButtonProps,
  type IPressableProps,
  View,
  Pressable as _Pressable,
} from "native-base";

import { type Route } from "../libs/utils";
import { useLinkProps } from "../libs/hooks";
import {
  pressableBaseStyle,
  solidButtonStyle,
  subtleButtonStyle,
} from "../styling/theme";

export type LinkTo = {
  linkTo?: ReturnType<typeof Route>;
};

export type LinkCompatibleButtonBaseProps = {
  children: ReactNode;
} & LinkTo;

type LinkButtonProps = Required<LinkCompatibleButtonBaseProps> &
  Omit<IButtonProps | IPressableProps, keyof LinkCompatibleButtonBaseProps>;

function LinkButton({
  linkTo,
  isDisabled,
  children,
  onPress,
  ...rest
}: LinkButtonProps) {
  const { onPress: onClick, ...restLinkProps } =
    useLinkProps(linkTo, onPress) ?? {};

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handler = useCallback(() => {
    const unsetIsClicked = () => {
      setIsClicked(false);
      // @ts-ignore
      window.removeEventListener("mouseup", unsetIsClicked);
      // @ts-ignore
      window.removeEventListener("drop", unsetIsClicked);
      // @ts-ignore
      window.removeEventListener("dragend", unsetIsClicked);
      // @ts-ignore
      window.removeEventListener("contextmenu", unsetIsClicked);
    };

    // @ts-ignore
    window.addEventListener("mouseup", unsetIsClicked);
    // @ts-ignore
    window.addEventListener("drop", unsetIsClicked);
    // @ts-ignore
    window.addEventListener("dragend", unsetIsClicked);
    // @ts-ignore
    window.addEventListener("contextmenu", unsetIsClicked);
  }, []);

  return (
    <View
      {...restLinkProps}
      justifyContent={"center"}
      opacity={isDisabled ? 0.5 : isClicked ? 0.5 : isHovered ? 0.72 : 1}
      // @ts-ignore
      tabIndex={isDisabled ? -1 : 0}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={isDisabled ? undefined : onClick}
      onPress={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      isDisabled={isDisabled}
      userSelect={"none"}
      onMouseDown={() => {
        handler();
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onDragEnd={() => {
        setIsClicked(false);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      {...rest}
    >
      {children}
    </View>
  );
}

type ButtonProps = LinkCompatibleButtonBaseProps &
  Omit<IButtonProps, keyof LinkCompatibleButtonBaseProps>;

export function SolidButton({ linkTo, children, ...rest }: ButtonProps) {
  return linkTo && Platform.OS === "web" ? (
    <LinkButton linkTo={linkTo} {...solidButtonStyle} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <Button {...rest}>{children}</Button>
  );
}

export function SubtleButton({ linkTo, children, ...rest }: ButtonProps) {
  return linkTo && Platform.OS === "web" ? (
    <LinkButton linkTo={linkTo} {...subtleButtonStyle} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <Button {...rest} variant={"subtle"}>
      {children}
    </Button>
  );
}

export type PressableProps = LinkCompatibleButtonBaseProps &
  Omit<IPressableProps, keyof LinkCompatibleButtonBaseProps>;

export function Pressable({ linkTo, children, ...rest }: PressableProps) {
  return linkTo && Platform.OS === "web" ? (
    <LinkButton linkTo={linkTo} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <_Pressable {...pressableBaseStyle} {...rest}>
      {children}
    </_Pressable>
  );
}
