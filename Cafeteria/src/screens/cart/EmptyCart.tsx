import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import AppText from "../../components/text/AppText";
import { AppFonts } from "../../styles/fonts";
import { AppColors } from "../../styles/colors";
import AppButton from "../../components/buttons/AppButton";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const EmptyCart = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="shopping-outline"
        size={s(100)}
        color={AppColors.primary}
        style={styles.icon}
      />
      <AppText style={styles.title}>Tu carrito esta vacío</AppText>
      <AppText style={styles.subTitle}>
        Una vez que selecciones algun platillo o alimento, tu carrito aparecerá
        aquí
      </AppText>
      <AppButton
        title="Start Shopping"
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      />
    </View>
  );
};

export default EmptyCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: s(20),
  },
  title: {
    fontSize: s(20),
    fontFamily: AppFonts.Bold,
    color: AppColors.primary,
    marginBottom: vs(10),
  },
  subTitle: {
    fontSize: s(16),
    fontFamily: AppFonts.Medium,
    color: AppColors.medGray,
    textAlign: "center",
    marginBottom: vs(20),
  },
  button: {
    width: "80%",
  },
  icon: {
    marginBottom: vs(20),
    opacity: 0.9,
  },
});
