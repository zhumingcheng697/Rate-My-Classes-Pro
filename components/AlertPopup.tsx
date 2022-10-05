import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
} from "react";
import { Keyboard } from "react-native";
import { Button, AlertDialog, theme } from "native-base";
import { useIsFocused } from "@react-navigation/native";

import { subtleBorder } from "../libs/colors";
import { colorModeResponsiveStyle } from "../libs/color-mode-utils";
import { textColorStyle } from "../libs/theme";

export type AlertPopupProps = {
  isOpen: boolean;
  header?: string;
  body?: string;
  footer?: (ref: MutableRefObject<any>) => ReactNode;
  footerPrimaryButton?: ReactElement;
  onClose: () => any;
  onlyShowWhenFocused?: boolean;
};

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  isOpen,
  footer,
  footerPrimaryButton,
  onClose,
  onlyShowWhenFocused = true,
}: AlertPopupProps) {
  const ref = useRef();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isOpen && isFocused) {
      Keyboard.dismiss();
    }
  }, [isOpen, isFocused]);

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={isOpen && (!onlyShowWhenFocused || isFocused)}
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
