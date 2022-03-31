import { useRef, type ReactNode, type MutableRefObject } from "react";
import { Button, AlertDialog } from "native-base";
import { type IAlertDialogProps } from "native-base/lib/typescript/components/composites";

type AlertPopupBaseProps = {
  header?: string;
  body?: string;
  footer?: (ref: MutableRefObject<any>) => ReactNode;
  onClose: () => any;
};

export type AlertPopupProps = AlertPopupBaseProps &
  Omit<IAlertDialogProps, keyof AlertPopupBaseProps | "leastDestructiveRef">;

export default function AlertPopup({
  header = "Unable to Load Class Information",
  body = "Please check your internet connection or try again later.",
  footer,
  onClose,
  ...rest
}: AlertPopupProps) {
  const ref = useRef();

  return (
    <AlertDialog leastDestructiveRef={ref} onClose={onClose} {...rest}>
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
