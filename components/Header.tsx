import { Text, type ITextProps } from "native-base";

export default function Header({ children, ...prop }: ITextProps) {
  return (
    <Text {...prop} fontWeight={"bold"} fontSize={"3xl"} lineHeight={"xs"}>
      {children}
    </Text>
  );
}
