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
  const { width } = rest;

  return (
    <Button {...rest} paddingX={"0"} variant={"subtle"}>
      <Text
        maxWidth={width}
        paddingX={"5px"}
        variant={"subtleButton"}
        fontWeight={"medium"}
        lineHeight={"sm"}
        numberOfLines={2}
      >
        {primaryText}
      </Text>
      {secondaryText && (
        <Text
          maxWidth={width}
          paddingX={"5px"}
          fontSize={"sm"}
          textAlign={"center"}
          numberOfLines={2}
        >
          {secondaryText}
        </Text>
      )}
    </Button>
  );
}
