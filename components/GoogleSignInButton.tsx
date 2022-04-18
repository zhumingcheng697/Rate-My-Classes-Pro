import React from "react";
import { Button, type IButtonProps, Icon, Text } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function GoogleSignInButton(props: IButtonProps) {
  return (
    <Button
      {...props}
      background={"white"}
      shadow={"0"}
      borderColor={"gray.200"}
      _dark={{
        shadow: "none",
        background: "background.secondary.dark",
        borderColor: "background.secondary.dark",
      }}
      borderWidth={"1px"}
      startIcon={
        <Icon
          color={"black"}
          _dark={{ color: "white" }}
          as={<Ionicons name={"logo-google"} />}
        />
      }
    >
      <Text variant={"button"} color={"black"} _dark={{ color: "white" }}>
        Continue with Google
      </Text>
    </Button>
  );
}
