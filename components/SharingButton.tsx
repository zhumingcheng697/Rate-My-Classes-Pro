import React, { useCallback, useMemo, useRef, useState } from "react";
import { Platform, Share } from "react-native";
import { View, Button, Icon, Toast, Text, HStack } from "native-base";
import { type RouteProp, useRoute } from "@react-navigation/native";
import Clipboard from "@react-native-clipboard/clipboard";
import Ionicons from "react-native-vector-icons/Ionicons";
import { WEB_DEPLOYMENT_URL } from "react-native-dotenv";

import type {
  ExploreNavigationParamList,
  MeNavigationParamList,
  SearchNavigationParamList,
} from "../libs/types";
import { useInitialTabName } from "../libs/hooks";
import { composeErrorMessage } from "../libs/utils";
import { stringifyRoute } from "../navigation/linking/stringify";
import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import colors from "../styling/colors";
import AlertPopup from "./AlertPopup";
import { IconButton } from "./LinkCompatibleButton";

function showConfirmation(message: string) {
  Toast.closeAll();

  setTimeout(() => {
    Toast.show({
      duration: 3000,
      placement: "top",
      render: () => (
        <HStack
          space={"4px"}
          paddingX={"18px"}
          paddingY={"8px"}
          borderRadius={20}
          {...colorModeResponsiveStyle((selector) => ({
            background: selector(colors.background.tertiary),
          }))}
        >
          <Text fontWeight={"semibold"} fontSize={"md"}>
            {message}
          </Text>
          <Icon
            size={"22px"}
            marginRight={"-4px"}
            {...colorModeResponsiveStyle((selector) => ({
              color: selector(colors.nyu),
            }))}
            as={<Ionicons name={"checkmark-outline"} />}
          />
        </HStack>
      ),
    });
  }, 50);
}

type SharingButtonProps = {
  url?: string;
  copyLink: (url: string) => void;
};

function NativeSharingButton({ url, copyLink }: SharingButtonProps) {
  const [shareAlert, setShareAlert] = useState(false);
  const [shareError, setShareError] = useState<any>(null);

  const ref = useRef<{ _nativeTag?: number }>();
  const anchor = ref.current?._nativeTag;

  return (
    <>
      <AlertPopup
        isOpen={shareAlert}
        header={"Unable to Share"}
        body={composeErrorMessage(shareError)}
        onClose={() => setShareAlert(false)}
        footerPrimaryButton={
          url
            ? (isCompact) => (
                <Button
                  borderRadius={isCompact ? 8 : undefined}
                  py={isCompact ? "5px" : "8px"}
                  onPress={() => {
                    setShareAlert(false);
                    copyLink(url);
                  }}
                >
                  Copy Link
                </Button>
              )
            : undefined
        }
      />
      <View ref={ref}>
        <IconButton
          disabled={!url}
          isDisabled={!url}
          marginRight={"5px"}
          padding={"5px"}
          icon={<Icon as={<Ionicons name={"share-outline"} />} />}
          onPress={() => {
            if (url) {
              Share.share(
                Platform.OS === "ios" ? { url } : { message: url },
                typeof anchor === "number" && Platform.OS === "ios"
                  ? { anchor }
                  : undefined
              ).catch((err) => {
                if (!/Cancel/i.test(composeErrorMessage(err, ""))) {
                  console.error(err);
                  setShareError(err);
                  setShareAlert(true);
                }
              });
            }
          }}
        />
      </View>
    </>
  );
}

function WebSharingButton({ url, copyLink }: SharingButtonProps) {
  return (
    <IconButton
      disabled={!url}
      isDisabled={!url}
      variant={"unstyled"}
      marginRight={"5px"}
      padding={"5px"}
      icon={<Icon as={<Ionicons name={"link-outline"} />} />}
      onPress={() => {
        if (url) {
          copyLink(url);
        }
      }}
    />
  );
}

type StackRouteProp =
  | RouteProp<ExploreNavigationParamList>
  | RouteProp<SearchNavigationParamList>
  | RouteProp<MeNavigationParamList>;

export default function SharingButton() {
  const tabName = useInitialTabName();
  const { name, params } = useRoute<StackRouteProp>();
  const path = useMemo(
    () => tabName && stringifyRoute(tabName, name, params),
    [tabName, name, params]
  );
  const [copyAlert, setCopyAlert] = useState(false);
  const [copyError, setCopyError] = useState<any>(null);
  const url = path && WEB_DEPLOYMENT_URL + path;

  const copyLink = useCallback((link: string) => {
    if (link) {
      try {
        Clipboard.setString(link);
        showConfirmation("Link Copied");
      } catch (e) {
        console.error(e);
        setCopyError(e);
        setCopyAlert(true);
      }
    }
  }, []);

  return (
    <>
      <AlertPopup
        isOpen={copyAlert}
        header={"Unable to Copy"}
        body={composeErrorMessage(copyError)}
        onClose={() => setCopyAlert(false)}
      />
      {Platform.OS !== "web" ? (
        <NativeSharingButton url={url} copyLink={copyLink} />
      ) : (
        <WebSharingButton url={url} copyLink={copyLink} />
      )}
    </>
  );
}
