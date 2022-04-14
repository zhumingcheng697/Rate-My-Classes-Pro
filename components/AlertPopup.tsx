import React, {
  useRef,
  type ReactNode,
  type ReactElement,
  type MutableRefObject,
  useEffect,
} from "react";
import { Keyboard } from "react-native";
import { Button, AlertDialog } from "native-base";

export type AlertPopupProps = {
  isOpen: boolean;
  header?: string;
  body?: string;
  footer?: (ref: MutableRefObject<any>) => ReactNode;
  footerPrimaryButton?: ReactElement;
  onClose: () => any;
};

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  isOpen,
  footer,
  footerPrimaryButton,
  onClose,
}: AlertPopupProps) {
  const ref = useRef();

  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  return (
    <AlertDialog leastDestructiveRef={ref} isOpen={isOpen} onClose={onClose}>
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
                _hover={{ opacity: 0.5 }}
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
