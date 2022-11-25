import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Animated, Keyboard, Platform, type ScrollView } from "react-native";
import { Button, AlertDialog, theme } from "native-base";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { subtleBorder } from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import { textColorStyle } from "../styling/theme";
import { useAuth } from "../mongodb/auth";
import { useDimensions, useKeyboardHeight } from "../libs/hooks";

export type AlertPopupProps = {
  isOpen: boolean;
  header?: string;
  body?: ReactNode;
  global?: boolean;
  autoDismiss?: boolean;
  scrollOnKeyboard?: boolean;
  footer?: (ref: MutableRefObject<any>, isCompact: boolean) => ReactNode;
  footerPrimaryButton?: (isCompact: boolean) => ReactElement;
  onClose: () => any;
};

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  global = false,
  autoDismiss = false,
  scrollOnKeyboard = false,
  isOpen,
  footer,
  footerPrimaryButton,
  onClose,
}: AlertPopupProps) {
  const ref = useRef();
  const keyboardHeight = useKeyboardHeight();
  const isFocused = useIsFocused();
  const { globalAlerts, setGlobalAlerts } = useAuth();
  const [shouldOpen, setShouldOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen && isFocused) {
      Keyboard.dismiss();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isFocused) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  useEffect(() => {
    if (global) {
      setGlobalAlerts((globalAlerts) => {
        const res = new Set(globalAlerts);
        if (isOpen) {
          res.add(ref);
        } else {
          res.delete(ref);
        }
        return res;
      });
    }
  }, [isOpen, global]);

  useEffect(() => {
    if (
      globalAlerts.size <= 0 &&
      !global &&
      autoDismiss &&
      isOpen &&
      isFocused
    ) {
      onClose();
    }
  }, [globalAlerts.size]);

  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    if (isOpen && (global || (isFocused && globalAlerts.size <= 0))) {
      timeout.current = setTimeout(() => {
        setShouldOpen(
          isOpen && (global || (isFocused && globalAlerts.size <= 0))
        );
      }, 300);
    } else {
      setShouldOpen(false);
    }
  }, [isOpen, global, isFocused, globalAlerts.size]);

  const { height, width } = useDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const isCompact = useMemo(
    () =>
      (Platform.OS === "ios" &&
        /phone/i.test(Platform.constants.interfaceIdiom) &&
        width > height) ||
      height < 400,
    [Platform, width, height]
  );

  const maxHeight = useRef(
    new Animated.Value(
      height - top - (keyboardHeight ? keyboardHeight + 10 : bottom + 40)
    )
  ).current;

  const translateY = useRef(
    new Animated.Value(keyboardHeight ? (top - keyboardHeight) / 2 : 0)
  ).current;

  const scrollRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(maxHeight, {
          toValue:
            height - top - (keyboardHeight ? keyboardHeight + 10 : bottom + 40),
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(translateY, {
          toValue: keyboardHeight ? (top - keyboardHeight) / 2 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        if (scrollOnKeyboard && keyboardHeight && scrollRef.current)
          scrollRef.current.scrollToEnd();
      });
    }, 50);
  }, [keyboardHeight, height, top, bottom]);

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={shouldOpen}
      onClose={onClose}
    >
      <Animated.View
        style={{
          maxHeight,
          transform: [{ translateY }, { perspective: 1000 }],
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <AlertDialog.Content
          maxHeight={"100%"}
          {...colorModeResponsiveStyle((selector) => ({
            background: selector({
              light: theme.colors.gray[50],
              dark: theme.colors.gray[700],
            }),
          }))}
        >
          <AlertDialog.Header
            py={isCompact ? "9px" : undefined}
            _text={textColorStyle}
            borderColor={subtleBorder}
          >
            {header}
          </AlertDialog.Header>
          <AlertDialog.Body
            ref={scrollRef}
            pt={isCompact ? "5px" : undefined}
            pb={isCompact ? "10px" : undefined}
            _text={colorModeResponsiveStyle((selector) => ({
              color: selector({
                light: theme.colors.gray[500],
                dark: theme.colors.gray[300],
              }),
            }))}
          >
            {body}
          </AlertDialog.Body>
          <AlertDialog.Footer
            py={isCompact ? "7px" : undefined}
            {...colorModeResponsiveStyle((selector) => ({
              background: selector({
                light: theme.colors.gray[100],
                dark: theme.colors.gray[600],
              }),
            }))}
          >
            {footer ? (
              footer(ref, isCompact)
            ) : footerPrimaryButton ? (
              <Button.Group space={2}>
                <Button
                  variant="unstyled"
                  _pressed={{ opacity: 0.5 }}
                  _hover={{ opacity: 0.72 }}
                  py={isCompact ? "5px" : undefined}
                  onPress={onClose}
                  ref={ref}
                >
                  Cancel
                </Button>
                {footerPrimaryButton(isCompact)}
              </Button.Group>
            ) : (
              <Button
                ref={ref}
                onPress={onClose}
                borderRadius={isCompact ? 8 : undefined}
                py={isCompact ? "5px" : undefined}
              >
                OK
              </Button>
            )}
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </Animated.View>
    </AlertDialog>
  );
}
