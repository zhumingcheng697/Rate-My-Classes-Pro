import React, {
  type ReactNode,
  type ReactText,
  useState,
  useCallback,
} from "react";
import { Platform } from "react-native";
import {
  Button,
  type IButtonProps,
  type IPressableProps,
  type ITextProps,
  View,
  Pressable as _Pressable,
  Flex,
  Text,
  Icon,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useLinkProps } from "../libs/hooks";
import {
  buttonBaseStyle,
  pressableBaseStyle,
  solidButtonStyle,
  subtleButtonStyle,
} from "../styling/theme";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import colors from "../styling/colors";

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

type LeftAlignedButtonBaseProps = {
  title?: string;
  _text?: ITextProps;
  showChevron?: boolean;
  children?: ReactText;
} & LinkTo;

export type LeftAlignedButtonProps = LeftAlignedButtonBaseProps &
  Omit<IPressableProps, keyof LeftAlignedButtonBaseProps>;

export function LeftAlignedButton({
  title,
  _text,
  showChevron = true,
  children,
  ...rest
}: LeftAlignedButtonProps) {
  return (
    <Pressable {...pressableBaseStyle} {...rest}>
      <Flex
        {...buttonBaseStyle}
        justifyContent={"space-between"}
        flexDirection={"row"}
        alignItems={"center"}
        alignContent={"center"}
        {...colorModeResponsiveStyle((selector) => ({
          background: selector(colors.background.secondary),
        }))}
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
    </Pressable>
  );
}

type PlainTextButtonBaseProps = {
  title?: string;
  _text?: ITextProps;
  children?: ReactText;
} & LinkTo;

export type PlainTextButtonProps = PlainTextButtonBaseProps &
  Omit<IPressableProps, keyof PlainTextButtonBaseProps>;

export function PlainTextButton({
  title,
  _text,
  children,
  ...rest
}: PlainTextButtonProps) {
  _text = Object.assign(
    {
      fontWeight: "semibold",
      textAlign: "center",
      ...colorModeResponsiveStyle((selector) => ({
        color: selector(colors.nyu),
      })),
    },
    _text
  );

  return (
    <Pressable {...pressableBaseStyle} {...rest}>
      <Text {..._text}>{title ?? children ?? "Button"}</Text>
    </Pressable>
  );
}

type TieredTextButtonBaseProps = {
  primaryText: string;
  secondaryText?: string;
} & LinkTo;

export type TieredTextButtonProps = TieredTextButtonBaseProps &
  Omit<IButtonProps, keyof TieredTextButtonBaseProps>;

export function TieredTextButton({
  primaryText,
  secondaryText,
  ...rest
}: TieredTextButtonProps) {
  const { width } = rest;

  return (
    <SubtleButton {...rest}>
      <Text
        width={width}
        paddingX={"8px"}
        variant={"subtleButton"}
        fontWeight={"medium"}
        lineHeight={"sm"}
        numberOfLines={2}
      >
        {primaryText}
      </Text>
      {!!secondaryText && (
        <Text
          width={width}
          paddingX={"8px"}
          fontSize={"sm"}
          textAlign={"center"}
          numberOfLines={2}
        >
          {secondaryText}
        </Text>
      )}
    </SubtleButton>
  );
}
