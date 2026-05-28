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

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUsername] = useState("");
  const navigation = useNavigation()

  return (
    <AppSaveView style={styles.container}>
      <Image source={IMAGES.appLogin} style={styles.loginImage} />
      <AppText style={styles.loginTitle}>¡Bienvenido! ✌️</AppText>
      <AppText style={styles.loginSubtitle}>
        ¡Parece que eres nuevo por aquí! Crea una cuenta para disfrutar de una
        experiencia completa.
      </AppText>
      <AppTextInput placeholder="Nombre" onChangeText={setUsername} />
      <AppTextInput placeholder="Correo electrónico" onChangeText={setEmail} />
      <AppTextInput
        placeholder="Contraseña"
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton title="Crear cuenta" />
      <AppButton
        title="Volver al inicio de sesión"
        style={styles.signInButton}
        textColor={AppColors.primary}
        onPress={() => navigation.navigate("SignInScreen")}
      />
    </AppSaveView>
  );
};

export default SignUpScreen;

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
  signInButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    marginTop: vs(15),
    borderColor: AppColors.primary,
  },
});
