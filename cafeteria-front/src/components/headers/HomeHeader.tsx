import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { IMAGES } from '../../constants/images-paths'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={IMAGES.appLogin} style={styles.logo}/>
    </View>
  )
}

export default HomeHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: vs(10)
  },
  logo:{
    height: vs(40),
    width: s(40),
  }
})