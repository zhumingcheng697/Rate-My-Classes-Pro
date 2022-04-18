import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
} from "react";
import { Keyboard } from "react-native";
import { Button, AlertDialog } from "native-base";
import { useIsFocused } from "@react-navigation/native";

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
      <AlertDialog.Content>
        <AlertDialog.Header>{header}</AlertDialog.Header>
        <AlertDialog.Body>{body}</AlertDialog.Body>
        <AlertDialog.Footer>
          {footer ? (
            footer(ref)
          ) : footerPrimaryButton ? (
            <Button.Group space={2}>
              <Button
                variant="unstyled"
                _pressed={{ opacity: 0.5 }}
                _hover={{ opacity: 0.75 }}
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
