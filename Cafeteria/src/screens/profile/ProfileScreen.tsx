import { StyleSheet, Text, View } from "react-native";
import React from "react";
import AppSaveView from "../../components/views/AppSaveView";
import HomeHeader from "../../components/headers/HomeHeader";
import ProfileSectionButton from "../../components/buttons/ProfileSectionButton";
import { sharedPaddingHorizontal } from "../../styles/sharedStyles";
import AppText from "../../components/text/AppText";
import { s, vs } from "react-native-size-matters";

const ProfileScreen = () => {
  return (
    <AppSaveView>
      <HomeHeader />
      <AppText variant="bold" style={{ fontSize: s(18), marginTop: vs(10) }}>
        Hola, Abraham
      </AppText>
      <View style={{ paddingHorizontal: sharedPaddingHorizontal }}>
        <ProfileSectionButton title={"Mis Ordenes"} />
        <ProfileSectionButton title={"Idioma"} />
        <ProfileSectionButton title={"Cerrar Sesión"} />
      </View>
    </AppSaveView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
