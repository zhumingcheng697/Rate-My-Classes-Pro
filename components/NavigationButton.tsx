import {
  Flex,
  Spacer,
  Icon,
  Button,
  type IButtonProps,
  Text,
  type ITextProps,
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type NavigationButtonProps = {
  title: string;
  _text?: ITextProps;
};

export default function NavigationButton({
  title,
  _text,
  ...rest
}: NavigationButtonProps & Omit<IButtonProps, keyof NavigationButtonProps>) {
  return (
    <Button {...rest} variant={"subtle"}>
      <Flex
        justifyContent={"space-evenly"}
        flexDirection={"row"}
        width={"100%"}
      >
        <Text {..._text} variant={"subtleButton"}>
          {title}
        </Text>
        <Spacer />
        <Icon marginRight={"-5px"} as={<Ionicons name={"chevron-forward"} />} />
      </Flex>
    </Button>
  );
}
