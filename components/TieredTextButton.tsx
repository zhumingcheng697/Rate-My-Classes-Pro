import { Text, Button, type IButtonProps } from "native-base";

type TieredTextButtonBaseProps = {
  primaryText: string;
  secondaryText?: string;
};

export type TieredTextButtonProps = TieredTextButtonBaseProps &
  Omit<IButtonProps, keyof TieredTextButtonBaseProps>;

export default function TieredTextButton({
  primaryText,
  secondaryText,
  ...rest
}: TieredTextButtonProps) {
  return (
    <Button {...rest} variant={"subtle"}>
      <Text
        variant={"subtleButton"}
        fontWeight={"medium"}
        lineHeight={"sm"}
        numberOfLines={2}
      >
        {primaryText}
      </Text>
      {secondaryText && (
        <Text fontSize={"sm"} textAlign={"center"} numberOfLines={2}>
          {secondaryText}
        </Text>
      )}
    </Button>
  );
}
