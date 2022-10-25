import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
  useState,
} from "react";
import { Keyboard } from "react-native";
import { Button, AlertDialog, theme } from "native-base";
import { useIsFocused } from "@react-navigation/native";

import { subtleBorder } from "../styling/colors";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import { textColorStyle } from "../styling/theme";
import { useAuth } from "../mongodb/auth";

export type AlertPopupProps = {
  isOpen: boolean;
  header?: string;
  body?: string;
  global?: boolean;
  autoDismiss?: boolean;
  footer?: (ref: MutableRefObject<any>) => ReactNode;
  footerPrimaryButton?: ReactElement;
  onClose: () => any;
};

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  global = false,
  autoDismiss = true,
  isOpen,
  footer,
  footerPrimaryButton,
  onClose,
}: AlertPopupProps) {
  const ref = useRef();
  const isFocused = useIsFocused();
  const { globalAlerts, setGlobalAlerts } = useAuth();
  const [shouldOpen, setShouldOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen && isFocused) {
      Keyboard.dismiss();
    }
  }, [isOpen, isFocused]);

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

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={shouldOpen}
      onClose={onClose}
    >
      <AlertDialog.Content
        {...colorModeResponsiveStyle((selector) => ({
          background: selector({
            light: theme.colors.gray[50],
            dark: theme.colors.gray[700],
          }),
        }))}
      >
        <AlertDialog.Header _text={textColorStyle} borderColor={subtleBorder}>
          {header}
        </AlertDialog.Header>
        <AlertDialog.Body
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
          {...colorModeResponsiveStyle((selector) => ({
            background: selector({
              light: theme.colors.gray[100],
              dark: theme.colors.gray[600],
            }),
          }))}
        >
          {footer ? (
            footer(ref)
          ) : footerPrimaryButton ? (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.72 }}
                onPress={onClose}
                ref={ref}
              >
                Cancel
              </Button>
              {footerPrimaryButton}
            </Button.Group>
          ) : (
            <Button ref={ref} onPress={onClose}>
              OK
            </Button>
          )}
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
}
