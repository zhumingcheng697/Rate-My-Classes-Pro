import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
  useState,
  useMemo,
} from "react";
import { Keyboard, Platform } from "react-native";
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
  footer?: (ref: MutableRefObject<any>, isLandscape: boolean) => ReactNode;
  footerPrimaryButton?: (isLandscape: boolean) => ReactElement;
  onClose: () => any;
};

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  global = false,
  autoDismiss = false,
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
  const { top } = useSafeAreaInsets();
  const isLandscape = useMemo(
    () =>
      Platform.OS === "ios" &&
      /phone/i.test(Platform.constants.interfaceIdiom) &&
      width > height,
    [Platform, width, height]
  );

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={shouldOpen}
      onClose={onClose}
    >
      <AlertDialog.Content
        maxHeight={
          keyboardHeight ? height - top - keyboardHeight - 10 + "px" : undefined
        }
        marginTop={keyboardHeight ? top + "px" : undefined}
        bottom={keyboardHeight ? keyboardHeight / 2 + "px" : undefined}
        {...colorModeResponsiveStyle((selector) => ({
          background: selector({
            light: theme.colors.gray[50],
            dark: theme.colors.gray[700],
          }),
        }))}
      >
        <AlertDialog.Header
          py={isLandscape ? "10px" : undefined}
          _text={textColorStyle}
          borderColor={subtleBorder}
        >
          {header}
        </AlertDialog.Header>
        <AlertDialog.Body
          pt={isLandscape ? "6px" : undefined}
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
          py={isLandscape ? "8px" : undefined}
          {...colorModeResponsiveStyle((selector) => ({
            background: selector({
              light: theme.colors.gray[100],
              dark: theme.colors.gray[600],
            }),
          }))}
        >
          {footer ? (
            footer(ref, isLandscape)
          ) : footerPrimaryButton ? (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.72 }}
                py={isLandscape ? "5px" : undefined}
                onPress={onClose}
                ref={ref}
              >
                Cancel
              </Button>
              {footerPrimaryButton(isLandscape)}
            </Button.Group>
          ) : (
            <Button
              ref={ref}
              onPress={onClose}
              borderRadius={isLandscape ? 8 : undefined}
              py={isLandscape ? "5px" : undefined}
            >
              OK
            </Button>
          )}
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
