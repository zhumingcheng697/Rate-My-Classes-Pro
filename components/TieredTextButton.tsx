import { Pressable, VStack, Text, type IPressableProps } from "native-base";

type TieredTextButtonProps = IPressableProps & {
  primaryText: string;
  secondaryText?: string;
};

export default function TieredTextButton({
  primaryText,
  secondaryText,
  ...rest
}: TieredTextButtonProps) {
  return (
    <Pressable {...rest} background={"background.secondary"} borderRadius={12}>
      <VStack height={"100%"} justifyContent={"center"} marginX={2}>
        <Text
          color={"nyu"}
          fontSize={"md"}
          fontWeight={"medium"}
          lineHeight={"sm"}
          textAlign={"center"}
          numberOfLines={2}
        >
          {primaryText}
        </Text>
        {secondaryText && <Text textAlign={"center"}>{secondaryText}</Text>}
      </VStack>
    </Pressable>
  );
}
