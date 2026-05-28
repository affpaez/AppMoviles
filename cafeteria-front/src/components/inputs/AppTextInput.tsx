import { StyleSheet, ViewStyle, TextStyle, TextInput } from "react-native";
import React, { FC } from "react";
import { AppColors } from "../../styles/colors";
import { s, vs } from "react-native-size-matters";

interface AppTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  style?: TextStyle;
}

const AppTextInput: FC<AppTextInputProps> = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
}) => {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      placeholderTextColor={AppColors.medGray}
      style={[styles.input, style]}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({
  input: {
    height: vs(48),
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: s(16),
    fontSize: s(14),
    backgroundColor: AppColors.white,
    width: "100%",
    color: '#374151',
  },
});
