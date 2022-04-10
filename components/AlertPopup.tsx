import React, {
  useRef,
  type ReactNode,
  type MutableRefObject,
  useEffect,
} from "react";
import { Keyboard } from "react-native";
import { Button, AlertDialog } from "native-base";
import { type IAlertDialogProps } from "native-base/lib/typescript/components/composites";

type AlertPopupBaseProps = {
  isOpen: boolean;
  header?: string;
  body?: string;
  footer?: (ref: MutableRefObject<any>) => ReactNode;
  onClose: () => any;
};

export type AlertPopupProps = AlertPopupBaseProps &
  Omit<IAlertDialogProps, keyof AlertPopupBaseProps | "leastDestructiveRef">;

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your network connection or try again later.",
  isOpen,
  footer,
  onClose,
  ...rest
}: AlertPopupProps) {
  const ref = useRef();

  useEffect(() => {
    if (isOpen) {
      Keyboard.dismiss();
    }
  }, [isOpen]);

  return (
    <AlertDialog
      leastDestructiveRef={ref}
      isOpen={isOpen}
      onClose={onClose}
      {...rest}
    >
      <AlertDialog.Content>
        <AlertDialog.Header>{header}</AlertDialog.Header>
        <AlertDialog.Body>{body}</AlertDialog.Body>
        <AlertDialog.Footer>
          {footer ? (
            footer(ref)
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
