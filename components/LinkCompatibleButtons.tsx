import React, { type ReactNode, useState, useCallback } from "react";
import { Platform } from "react-native";
import {
  Button,
  type IButtonProps,
  type IPressableProps,
  View,
  Pressable as _Pressable,
} from "native-base";

import { useLinkProps } from "../libs/hooks";
import {
  pressableBaseStyle,
  solidButtonStyle,
  subtleButtonStyle,
} from "../styling/theme";

export type LinkTo = {
  linkTo?: Parameters<typeof useLinkProps>[0];
};

export type LinkCompatibleButtonBaseProps = {
  children:
    | ReactNode
    | ((props: {
        isPressed: boolean;
        isHovered: boolean;
        isFocused: boolean;
      }) => ReactNode);
} & LinkTo;

type LinkButtonProps = LinkCompatibleButtonBaseProps & { href?: string } & Omit<
    IButtonProps | IPressableProps,
    keyof LinkCompatibleButtonBaseProps | "href"
  >;

function LinkButton({
  isDisabled,
  children,
  onPress,
  href,
  ...rest
}: LinkButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handler = useCallback(() => {
    const unsetIsClicked = () => {
      setIsPressed(false);
      window.removeEventListener("mouseup", unsetIsClicked);
      window.removeEventListener("drop", unsetIsClicked);
      window.removeEventListener("dragend", unsetIsClicked);
      window.removeEventListener("contextmenu", unsetIsClicked);
    };

    window.addEventListener("mouseup", unsetIsClicked);
    window.addEventListener("drop", unsetIsClicked);
    window.addEventListener("dragend", unsetIsClicked);
    window.addEventListener("contextmenu", unsetIsClicked);
  }, []);

  return (
    <View
      justifyContent={"center"}
      opacity={isDisabled ? 0.5 : isPressed ? 0.5 : isHovered ? 0.72 : 1}
      // @ts-ignore
      href={isDisabled ? undefined : href}
      tabIndex={isDisabled ? -1 : 0}
      cursor={isDisabled ? "not-allowed" : "pointer"}
      onClick={isDisabled ? undefined : onPress}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      isDisabled={isDisabled}
      userSelect={"none"}
      onMouseDown={() => {
        handler();
        setIsPressed(true);
      }}
      onMouseUp={() => setIsPressed(false)}
      onDragEnd={() => setIsPressed(false)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...rest}
    >
      {typeof children === "function"
        ? children({ isPressed, isFocused, isHovered })
        : children}
    </View>
  );
}

type ButtonProps = LinkCompatibleButtonBaseProps &
  Omit<IButtonProps, keyof LinkCompatibleButtonBaseProps>;

export function SolidButton({
  linkTo,
  onPress,
  children,
  ...rest
}: ButtonProps) {
  const linkProps = useLinkProps(linkTo ?? {}, onPress);

  return linkTo && Platform.OS === "web" ? (
    <LinkButton {...solidButtonStyle} {...linkProps} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <Button {...(linkTo ? linkProps : { onPress })} {...rest}>
      {children}
    </Button>
  );
}

export function SubtleButton({
  linkTo,
  onPress,
  children,
  ...rest
}: ButtonProps) {
  const linkProps = useLinkProps(linkTo ?? {}, onPress);

  return linkTo && Platform.OS === "web" ? (
    <LinkButton {...subtleButtonStyle} {...linkProps} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <Button
      {...(linkTo ? linkProps : { onPress })}
      {...rest}
      variant={"subtle"}
    >
      {children}
    </Button>
  );
}

export type PressableProps = LinkCompatibleButtonBaseProps &
  Omit<IPressableProps, keyof LinkCompatibleButtonBaseProps>;

export function Pressable({
  linkTo,
  onPress,
  children,
  ...rest
}: PressableProps) {
  const linkProps = useLinkProps(linkTo ?? {}, onPress);

  return linkTo && Platform.OS === "web" ? (
    <LinkButton {...linkProps} {...rest}>
      {children}
    </LinkButton>
  ) : (
    <_Pressable
      {...(linkTo ? linkProps : { onPress })}
      {...pressableBaseStyle}
      {...rest}
    >
      {children}
    </_Pressable>
  );
}
