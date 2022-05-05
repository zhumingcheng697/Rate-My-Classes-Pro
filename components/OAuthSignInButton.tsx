import React from "react";
import { Button, type IButtonProps, Icon, Text } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

type OAuthSignInButtonBaseProps = {
  provider: string;
};

export type OAuthSignInButtonProps = OAuthSignInButtonBaseProps &
  Omit<IButtonProps, keyof OAuthSignInButtonBaseProps>;

export default function OAuthSignInButton({
  provider,
  ...rest
}: OAuthSignInButtonProps) {
  return (
    <Button
      {...rest}
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
          size={"20px"}
          marginRight={"-2px"}
          as={<Ionicons name={`logo-${provider.toLowerCase()}`} />}
        />
      }
    >
      <Text variant={"button"} color={"black"} _dark={{ color: "white" }}>
        Continue with {provider}
      </Text>
    </Button>
  );
}
