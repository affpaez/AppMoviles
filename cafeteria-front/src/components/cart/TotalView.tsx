import { StyleSheet, Text, View } from 'react-native'
import React, { FC } from 'react'
import AppText from '../text/AppText'
import { s, vs } from 'react-native-size-matters'
import { AppColors } from '../../styles/colors'
import { IVA } from '../../constants/constants'

interface ITotalView {
  itemsPrice: number,
  orderTotal: number;
}

const TotalView : FC<ITotalView> = ({itemsPrice, orderTotal}) => {
  return (
    <View>
      <View style={styles.row}>
        <AppText style={styles.textTitle}>Subtotal:</AppText>
        <AppText style={styles.textPrice}>$ {itemsPrice}</AppText>
      </View>

      <View style={styles.row}>
        <AppText style={styles.textTitle}>IVA 8%:</AppText>
        <AppText style={styles.textPrice}>$ {(itemsPrice * IVA).toFixed(2)}</AppText>
      </View>

      <View style={styles.separator}/>

      <View style={styles.row}>
        <AppText style={styles.textTitle}>Total:</AppText>
        <AppText style={styles.textPrice}>$ {orderTotal}</AppText>
      </View>
    </View>
  )
}

export default TotalView

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: vs(10)
  },
  textTitle: {
    fontSize: s(16),
    flex: 1
  },
  textPrice: {
    fontSize: s(16),
    color: AppColors.primary
  },
  separator: {
    height: 1,
    width: "100%",
    backgroundColor: AppColors.lightGray,
    marginVertical: vs(5)
  }
})