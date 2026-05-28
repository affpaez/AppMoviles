import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { useCartStore } from '../../store/cartStore'
import { IVA } from '../../constants/constants'

const CheckoutNoCardScreen = () => {
  const navigation = useNavigation<any>()
  const { total } = useCartStore()
  const subtotal = total()
  const iva = subtotal * IVA
  const totalFinal = subtotal + iva
  const [codigo, setCodigo] = useState('')

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <AppText style={styles.headerSub}>Sauzal</AppText>
          <AppText variant="bold" style={styles.headerTitle}>Pago</AppText>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={s(28)} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.emptyCard}>
          <View style={styles.walletIcon}>
            <Ionicons name="wallet-outline" size={s(40)} color="#D17D66" />
          </View>
          <AppText variant="bold" style={styles.emptyTitle}>No tienes ninguna tarjeta</AppText>
          <AppText style={styles.emptySub}>Por favor agrega una tarjeta de crédito o débito para realizar tu orden</AppText>
          <TouchableOpacity style={styles.addCardLink} onPress={() => navigation.navigate('AddNewCardScreen')}>
            <AppText style={styles.addCardText}>+ Agregar tarjeta</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Subtotal</AppText>
            <AppText variant="bold" style={styles.summaryValue}>${subtotal.toFixed(2)}</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>IVA</AppText>
            <AppText variant="bold" style={styles.summaryValue}>${iva.toFixed(2)}</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Ionicons name="information-circle-outline" size={s(20)} color={AppColors.medGray} />
            <TextInput
              placeholder="Aplicar código de descuento"
              value={codigo}
              onChangeText={setCodigo}
              style={styles.discountInput}
              placeholderTextColor={AppColors.medGray}
            />
          </View>

          <View style={styles.totalRow}>
            <AppText variant="bold" style={styles.totalLabel}>Total</AppText>
            <AppText variant="bold" style={styles.totalValue}>${totalFinal.toFixed(2)}</AppText>
          </View>
        </View>
      </ScrollView>
    </AppSaveView>
  )
}

export default CheckoutNoCardScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal, backgroundColor: '#FDFDFD' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(12),
    marginBottom: vs(20),
  },
  backButton: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: s(12), color: AppColors.medGray },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  emptyCard: {
    backgroundColor: AppColors.white,
    borderRadius: s(32),
    padding: s(32),
    alignItems: 'center',
    marginBottom: vs(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  walletIcon: {
    width: s(80),
    height: s(60),
    borderRadius: s(12),
    backgroundColor: '#FDE8D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  emptyTitle: { fontSize: s(18), color: '#1F2937', marginBottom: vs(8) },
  emptySub: { fontSize: s(13), color: AppColors.medGray, textAlign: 'center', marginBottom: vs(20), paddingHorizontal: s(16) },
  addCardLink: {},
  addCardText: { fontSize: s(16), color: '#FBBF24', fontWeight: '700' },
  summary: {
    backgroundColor: AppColors.white,
    borderRadius: s(32),
    padding: s(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  summaryLabel: { fontSize: s(14), color: AppColors.medGray },
  summaryValue: { fontSize: s(16), color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: vs(12) },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: s(16),
    paddingHorizontal: s(14),
    height: vs(50),
    marginBottom: vs(12),
  },
  discountInput: {
    flex: 1,
    marginLeft: s(8),
    fontSize: s(13),
    color: AppColors.medGray,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: { fontSize: s(18), color: '#1F2937' },
  totalValue: { fontSize: s(22), color: '#FBBF24', fontWeight: '900' },
})
