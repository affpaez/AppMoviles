import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity } from 'react-native'
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
import { crearPedidoService } from '../../services/pedidos.service'
import { useAuthStore } from '../../store/authStore'
import { showMessage } from 'react-native-flash-message'

const CheckoutWithCardScreen = () => {
  const navigation = useNavigation<any>()
  const { items, total, limpiarCarrito } = useCartStore()
  const { usuario } = useAuthStore()
  const subtotal = total()
  const iva = subtotal * IVA
  const totalFinal = subtotal + iva
  const [codigo, setCodigo] = useState('')
  const [propina, setPropina] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handlePagar = async () => {
    try {
      setEnviando(true)
      const pedido = await crearPedidoService({
        usuarioId: usuario?.id,
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precio: item.precio,
          comentario: item.comentario,
          extras: item.extras.map((e) => ({ extraId: e.id, precio: e.precio })),
        })),
      })
      limpiarCarrito()
      navigation.navigate('OrderStatusScreen', { pedido })
    } catch (error: any) {
      showMessage({ message: 'Error al procesar el pago', type: 'danger' })
    } finally {
      setEnviando(false)
    }
  }

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
        <View style={styles.cardPreview}>
          <View style={styles.cardBg}>
            <View style={styles.cardCircles}>
              <View style={styles.cardCircleOuter} />
              <View style={styles.cardCircleInner} />
            </View>
            <View style={styles.cardBrand}>
              <View style={[styles.brandDot, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.brandDot, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
            </View>
            <AppText variant="bold" style={styles.cardNumber}>5123 4324 3123 2556</AppText>
          </View>
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
            <Ionicons name="pricetag-outline" size={s(18)} color={AppColors.medGray} />
            <TextInput
              placeholder="Aplicar código de descuento"
              value={codigo}
              onChangeText={setCodigo}
              style={styles.input}
              placeholderTextColor={AppColors.medGray}
            />
          </View>
          <View style={styles.inputRow}>
            <Ionicons name="cash-outline" size={s(18)} color={AppColors.medGray} />
            <TextInput
              placeholder="Agregar propina"
              value={propina}
              onChangeText={setPropina}
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={AppColors.medGray}
            />
          </View>

          <View style={styles.totalRow}>
            <AppText variant="bold" style={styles.totalLabel}>Total</AppText>
            <View style={styles.totalValueRow}>
              <AppText style={styles.totalSigno}>$</AppText>
              <AppText variant="bold" style={styles.totalValue}>{totalFinal.toFixed(2)}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Pagar" onPress={handlePagar} disabled={enviando} />
      </View>
    </AppSaveView>
  )
}

export default CheckoutWithCardScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal, backgroundColor: '#FDFDFD' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(12),
    marginBottom: vs(16),
  },
  backButton: {
    width: s(44),
    height: s(44),
    borderRadius: s(14),
    backgroundColor: AppColors.white,
    borderWidth: 1, borderColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: s(12), color: AppColors.medGray },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  cardPreview: { marginBottom: vs(16) },
  cardBg: {
    backgroundColor: '#2D2E3E',
    borderRadius: s(24),
    padding: s(20),
    minHeight: vs(180),
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  cardCircles: {
    position: 'absolute',
    right: -30,
    bottom: -60,
  },
  cardCircleOuter: {
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardCircleInner: {
    position: 'absolute',
    top: -40, left: -40,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  cardBrand: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(20), zIndex: 2 },
  brandDot: { width: s(24), height: s(24), borderRadius: s(12), opacity: 0.9 },
  cardNumber: { fontSize: s(18), color: AppColors.white, letterSpacing: 4, zIndex: 2, textAlign: 'center' },
  summary: {
    backgroundColor: AppColors.white,
    borderRadius: s(32), padding: s(20),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10) },
  summaryLabel: { fontSize: s(14), color: AppColors.medGray },
  summaryValue: { fontSize: s(16), color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: vs(12) },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: s(16), paddingHorizontal: s(14),
    height: vs(48), marginBottom: vs(10),
  },
  input: { flex: 1, marginLeft: s(8), fontSize: s(13), color: '#374151' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(8) },
  totalLabel: { fontSize: s(18), color: '#1F2937' },
  totalValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  totalSigno: { fontSize: s(12), color: '#FBBF24', fontWeight: 'bold', marginRight: s(2) },
  totalValue: { fontSize: s(22), color: '#1F2937', fontWeight: '900' },
  footer: { paddingVertical: vs(12) },
})
