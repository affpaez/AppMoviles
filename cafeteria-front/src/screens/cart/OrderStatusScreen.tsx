import { StyleSheet, View, ScrollView, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useCartStore } from '../../store/cartStore'

const OrderStatusScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { pedido } = route.params
  const { limpiarCarrito } = useCartStore()
  const esListo = pedido.estado === 'LISTO'
  const subtotal = pedido.subtotal || 0
  const iva = pedido.iva || 0
  const propina = pedido.propina || 0
  const total = pedido.total || 0

  const handleSalir = () => {
    limpiarCarrito()
    navigation.navigate('MainAppBottomTabs')
  }

  return (
    <AppSaveView style={styles.container}>
      <ScrollView>
        <View style={styles.statusCard}>
          {esListo ? (
            <>
              <AppText style={styles.statusLabel}>Tu comida esta lista</AppText>
              <AppText variant="bold" style={styles.statusDisfruta}>¡Disfruta!</AppText>
              <View style={styles.mascotContainer}>
                <View style={styles.mascotBg} />
                <Ionicons name="checkmark-circle" size={s(100)} color="#FFC107" />
              </View>
            </>
          ) : (
            <>
              <AppText style={styles.statusLabel}>Tu orden estará lista en:</AppText>
              <AppText variant="bold" style={styles.statusTime}>
                {pedido.tiempoEstimado ?? 10} minutos
              </AppText>
              <View style={styles.orbitContainer}>
                <View style={[styles.orbitCircle, { width: s(280), height: s(280), top: vs(10) }]} />
                <View style={[styles.orbitCircle, { width: s(200), height: s(200), top: vs(50) }]} />
                <View style={[styles.orbitDot, { top: '25%', right: '15%' }]} />
                <View style={[styles.orbitDot, { top: '15%', left: '5%' }]} />
                <View style={[styles.orbitDot, { bottom: '25%', right: '10%', backgroundColor: '#FEF3C7' }]} />
                <Image source={require('../../../assets/cimarron-like.png')} style={styles.orbitIcon} />
              </View>
            </>
          )}
        </View>

        <View style={styles.detailsCard}>
          <AppText variant="bold" style={styles.detailsTitle}>Resumen de tu orden</AppText>

          {pedido.items?.map((item: any, index: number) => (
            <View key={item.id || index} style={styles.itemRow}>
              <View style={styles.itemCircle}>
                <Ionicons name="fast-food-outline" size={s(18)} color={AppColors.medGray} />
              </View>
              <View style={styles.itemInfo}>
                <AppText variant="bold" style={styles.itemName}>{item.producto?.nombre || 'Producto'}</AppText>
                {item.comentario ? <AppText style={styles.itemComment}>{item.comentario}</AppText> : null}
                {item.extras?.length > 0 && (
                  <AppText style={styles.itemExtras}>+ {item.extras.map((e: any) => e.extra?.nombre || e.nombre).join(', ')}</AppText>
                )}
              </View>
              <View style={styles.itemPriceCol}>
                <AppText variant="bold" style={styles.itemPrice}>${((item.precio + (item.extras?.reduce?.((a: any, e: any) => a + (e.precio || e.extra?.precio || 0), 0) ?? 0)) * item.cantidad).toFixed(2)}</AppText>
                <AppText style={styles.itemQty}>{item.cantidad} x ${(item.precio + (item.extras?.reduce?.((a: any, e: any) => a + (e.precio || e.extra?.precio || 0), 0) ?? 0)).toFixed(2)}</AppText>
              </View>
            </View>
          ))}

          <View style={styles.pricing}>
            <View style={styles.pricingRow}>
              <AppText style={styles.pricingLabel}>Subtotal</AppText>
              <AppText variant="bold" style={styles.pricingValue}>${subtotal.toFixed(2)}</AppText>
            </View>
            {propina > 0 && (
              <View style={styles.pricingRow}>
                <AppText style={styles.pricingLabel}>Propina</AppText>
                <AppText variant="bold" style={styles.pricingValue}>${propina.toFixed(2)}</AppText>
              </View>
            )}
            <View style={styles.pricingRow}>
              <AppText style={styles.pricingLabel}>IVA (8%)</AppText>
              <AppText variant="bold" style={styles.pricingValue}>${iva.toFixed(2)}</AppText>
            </View>
            <View style={[styles.pricingRow, styles.pricingTotal]}>
              <AppText variant="bold" style={styles.totalLabelText}>Total</AppText>
              <View style={styles.totalValueRow}>
                <AppText style={styles.totalSigno}>$</AppText>
                <AppText variant="bold" style={styles.totalValue}>{total.toFixed(2)}</AppText>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="Continuar" onPress={handleSalir} />
      </View>
    </AppSaveView>
  )
}

export default OrderStatusScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  statusCard: {
    backgroundColor: AppColors.white, borderRadius: s(24), padding: s(20), alignItems: 'center', marginBottom: vs(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  statusLabel: { fontSize: s(14), color: '#6B7280', marginBottom: vs(4) },
  statusTime: { fontSize: s(24), color: '#FBBF24', marginBottom: vs(16) },
  statusDisfruta: { fontSize: s(24), color: '#FFC107', marginBottom: vs(24) },
  mascotContainer: { alignItems: 'center', justifyContent: 'center', width: s(160), height: s(240) },
  mascotBg: { ...StyleSheet.absoluteFillObject, borderRadius: s(80), backgroundColor: '#FFC107', opacity: 0.2, transform: [{ scale: 0.9 }] },
  orbitContainer: { height: vs(240), width: '100%', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orbitCircle: { position: 'absolute', borderRadius: 999, borderWidth: 1, borderColor: '#D1FAE5' },
  orbitDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: '#FBBF24' },
  orbitIcon: { zIndex: 2, width: s(100), height: s(140) },
  detailsCard: {
    backgroundColor: AppColors.white, borderRadius: s(24), padding: s(20), marginBottom: vs(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  detailsTitle: { fontSize: s(16), color: '#2D3142', marginBottom: vs(16) },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  itemCircle: { width: s(40), height: s(40), borderRadius: s(20), backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginRight: s(12) },
  itemInfo: { flex: 1 },
  itemName: { fontSize: s(13), color: '#1F2937' },
  itemComment: { fontSize: s(11), color: AppColors.medGray, marginTop: vs(2) },
  itemExtras: { fontSize: s(11), color: AppColors.primary, marginTop: vs(2) },
  itemPriceCol: { alignItems: 'flex-end' },
  itemPrice: { fontSize: s(14), color: '#1F2937' },
  itemQty: { fontSize: s(11), color: AppColors.medGray },
  pricing: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: vs(12) },
  pricingRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(8) },
  pricingLabel: { fontSize: s(13), color: AppColors.medGray },
  pricingValue: { fontSize: s(14), color: '#1F2937' },
  pricingTotal: { borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: vs(10), marginTop: vs(4) },
  totalLabelText: { fontSize: s(16), color: '#2D3142' },
  totalValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  totalSigno: { fontSize: s(10), color: '#FBBF24', fontWeight: 'bold', marginRight: s(2) },
  totalValue: { fontSize: s(20), color: '#2D3142' },
  footer: { paddingVertical: vs(12) },
})
