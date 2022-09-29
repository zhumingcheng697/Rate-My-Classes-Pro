import React from "react";
import { Button, type IButtonProps, Icon, Text } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";

import colors from "../libs/colors";
import { colorModeResponsiveStyle } from "../libs/color-mode-utils";

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
      shadow={"0"}
      borderWidth={"1px"}
      {...colorModeResponsiveStyle((selector) => ({
        background: selector({
          light: "#ffffff",
          dark: colors.background.secondary.dark,
        }),
        borderColor: selector({
          light: "#e4e4e7",
          dark: colors.background.secondary.dark,
        }),
      }))}
      startIcon={
        <Icon
          size={"20px"}
          marginRight={"-2px"}
          {...colorModeResponsiveStyle((selector) => ({
            color: selector({ light: "#000000", dark: "#ffffff" }),
          }))}
          as={<Ionicons name={`logo-${provider.toLowerCase()}`} />}
        />
      }
    >
      <Text
        variant={"button"}
        {...colorModeResponsiveStyle((selector) => ({
          color: selector({ light: "#000000", dark: "#ffffff" }),
        }))}
      >
        Continue with {provider}
      </Text>
    </Button>
  );
}
