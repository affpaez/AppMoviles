import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSaveView from "../../components/views/AppSaveView";
import { sharedPaddingHorizontal } from "../../styles/sharedStyles";
import { IMAGES } from "../../constants/images-paths";
import { s, vs } from "react-native-size-matters";
import AppTextInput from "../../components/inputs/AppTextInput";
import AppText from "../../components/text/AppText";
import AppButton from "../../components/buttons/AppButton";
import { AppColors } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";

const SignInScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  return (
    <AppSaveView style={styles.container}>
      <Image source={IMAGES.appLogin} style={styles.loginImage} />
      <AppText style={styles.loginTitle}>Empecemos a ordenar! 😁</AppText>
      <AppText style={styles.loginSubtitle}>
        Regístrate o inicia sesión para disfrutar de una experiencia digital
        completa de nuestra cafetería.
      </AppText>
      <AppTextInput placeholder="Correo electrónico" onChangeText={setEmail} />
      <AppTextInput
        placeholder="Contraseña"
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton
        title="Iniciar Sesión"
        onPress={() => navigation.getParent()?.navigate("MainAppBottomTabs")}
      />
      <AppButton
        title="Registrarse"
        style={styles.registerButton}
        textColor={AppColors.primary}
        onPress={() => navigation.navigate("SignUpScreen")}
      />
    </AppSaveView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: sharedPaddingHorizontal,
  },
  loginImage: {
    height: s(200),
    width: s(100),
    marginBottom: vs(30),
  },
  loginTitle: {
    fontSize: s(22),
    fontWeight: "600",
    color: "#1E1E1E",
    textAlign: "center",
    marginBottom: vs(10),
  },
  loginSubtitle: {
    fontSize: s(16),
    color: "#6B7280", // gris tipo UI moderno
    textAlign: "center",
    lineHeight: vs(20),
    marginBottom: vs(25),
    paddingHorizontal: s(10),
  },
  registerButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    marginTop: vs(15),
    borderColor: AppColors.primary,
  },
});
