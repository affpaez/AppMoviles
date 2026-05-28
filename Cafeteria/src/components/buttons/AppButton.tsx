import { StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native'
import React, { FC } from 'react'
import { s, vs } from 'react-native-size-matters'
import AppText from '../text/AppText'
import { AppColors } from '../../styles/colors'

interface AppButtonProps {
  onPress: () => void
  title: string
  backgroundColor?: string
  textColor?: string
  style?: ViewStyle | ViewStyle[]
  styleTitle?: TextStyle | TextStyle[]
  disabled?: boolean
}

const AppButton: FC<AppButtonProps> = ({
  onPress,
  title,
  backgroundColor = AppColors.primary,
  textColor = AppColors.white,
  style,
  styleTitle,
  disabled = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        { backgroundColor: disabled ? AppColors.disabledGray : backgroundColor },
        style
      ]}
      disabled={disabled}
    >
      <AppText
        style={[styles.textTitle, { color: textColor }, styleTitle]}
        variant="bold"
      >
        {title}
      </AppText>
    </TouchableOpacity>
  )
}

export default AppButton

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: vs(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: s(25),
    alignSelf: "center"
  },
  textTitle: {
    fontSize: s(16)
  }
})