import { Input, Pressable, Icon, type IInputProps } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type SearchBarProp = IInputProps & {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search",
  ...rest
}: SearchBarProp) {
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
          <Pressable
            onPress={() => {
              onChangeText("");
            }}
          >
            {({ isPressed, isHovered }) => (
              <Icon
                marginLeft={"-5px"}
                marginRight={"5px"}
                size={"sm"}
                color={isPressed || isHovered ? "gray.500" : "gray.400"}
                as={<Ionicons name={"close-circle"} />}
              />
            )}
          </Pressable>
        ) : undefined
      }
    />
  );
}
