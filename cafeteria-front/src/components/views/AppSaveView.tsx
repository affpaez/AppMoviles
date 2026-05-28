import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  ViewStyle,
} from "react-native";
import React, { Children, FC, ReactNode } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../../styles/colors";
import { IS_Android } from "../../constants/constants";
import FlashMessage from "react-native-flash-message";

interface AppSaveViewProps {
  children: ReactNode;
  style?: ViewStyle;
}

const AppSaveView: FC<AppSaveViewProps> = ({ children, style }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, style]}>{children}</View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppSaveView;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AppColors.white,
    paddingTop: IS_Android ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
  },
});