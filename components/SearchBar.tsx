import { Input, Pressable, Icon, type IInputProps } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type SearchBarBaseProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export type SearchBarProps = SearchBarBaseProps &
  Omit<IInputProps, keyof SearchBarBaseProps>;

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  ...rest
}: SearchBarProps) {
  const pressedHoverStyle = { _icon: { color: "gray.300" } };

  return (
    <Input
      {...rest}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      enablesReturnKeyAutomatically={true}
      returnKeyType={"search"}
      leftElement={
        <Icon
          marginLeft={"5px"}
          marginRight={"-5px"}
          size={"sm"}
          color={"gray.400"}
          as={<Ionicons name={"search"} />}
        />
      }
      rightElement={
        value ? (
          <IconButton
            color={"gray.400"}
            variant={"unstyled"}
            _pressed={pressedHoverStyle}
            _hover={pressedHoverStyle}
            icon={
              <Icon size={"22px"} as={<Ionicons name={"close-circle"} />} />
            }
            onPress={() => {
              onChangeText("");
            }}
          />
        ) : undefined
      }
    />
  );
}
