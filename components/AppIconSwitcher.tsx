import React, { useCallback, useEffect, useState } from "react";
import { HStack, Icon, Image, Text, VStack } from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import { changeIcon, getIcon } from "react-native-change-icon";

import { colorModeResponsiveStyle } from "../styling/color-mode-utils";
import colors, { subtleBorder } from "../styling/colors";
import defaultIcon from "./../icons/default.png";
import violetIcon from "./../icons/violet.png";
import { Pressable } from "./LinkCompatibleButton";

type AppIconChoiceProps = {
  iconError: boolean;
  isViolet?: boolean;
  isVioletSelected: boolean | null;
  onSelect: (selectViolet: boolean) => void;
};

function AppIconChoice({
  iconError,
  isViolet = false,
  isVioletSelected,
  onSelect,
}: AppIconChoiceProps) {
  const isSelected = isViolet === isVioletSelected;

  return (
    <Pressable
      isDisabled={isVioletSelected === null || iconError}
      onPress={() => isViolet !== isVioletSelected && onSelect(isViolet)}
      marginTop={"5px"}
      marginX={"10px"}
    >
      <VStack
        margin={"5px"}
        justifyContent={"center"}
        alignContent={"center"}
        alignItems={"center"}
        space={"10px"}
      >
        <Image
          alt={isViolet ? "Violet App Icon" : "Default App Icon"}
          source={isViolet ? violetIcon : defaultIcon}
          borderRadius={"18px"}
          width={"80px"}
          height={"80px"}
        />
        <Icon
          {...colorModeResponsiveStyle((selector) => ({
            color: isSelected ? selector(colors.nyu) : subtleBorder,
          }))}
          size={"25px"}
          as={
            <Ionicons
              name={isSelected ? "checkmark-circle" : "ellipse-outline"}
            />
          }
        />
      </VStack>
    </Pressable>
  );
}

export default function AppIconSwitcher() {
  const [isVioletSelected, setIsVioletSelected] = useState<boolean | null>(
    null
  );
  const [iconError, setIconError] = useState(false);

  const resolveIcon = useCallback(async () => {
    try {
      const iconName = await getIcon();
      setIsVioletSelected(iconName === "VioletIcon");
    } catch (e) {
      setIconError(true);
      setIsVioletSelected(false);
      console.error(e);
    }
  }, []);

  useEffect(() => {
    resolveIcon();
  }, []);

  const selectIcon = useCallback(async (selectViolet: boolean) => {
    const wasVioletSelected = isVioletSelected;
    try {
      setIsVioletSelected(selectViolet);
      await changeIcon(selectViolet ? "VioletIcon" : null);
      await resolveIcon();
    } catch (e: any) {
      if (e?.message !== "ICON_ALREADY_USED") {
        setIsVioletSelected(wasVioletSelected || false);
        setIconError(true);
        console.error(e);
      }
    }
  }, []);

  return (
    <VStack
      borderRadius={10}
      padding={"10px"}
      {...colorModeResponsiveStyle((selector) => ({
        background: selector(colors.background.secondary),
      }))}
    >
      <HStack justifyContent={"center"} flexWrap={"wrap"}>
        <AppIconChoice
          iconError={iconError}
          isVioletSelected={isVioletSelected}
          onSelect={selectIcon}
        />
        <AppIconChoice
          isViolet
          iconError={iconError}
          isVioletSelected={isVioletSelected}
          onSelect={selectIcon}
        />
      </HStack>
      {iconError && (
        <Text marginBottom={"5px"} textAlign={"center"} fontWeight={"medium"}>
          Alternate App Icon is not supported
        </Text>
      )}
    </VStack>
  );
}
