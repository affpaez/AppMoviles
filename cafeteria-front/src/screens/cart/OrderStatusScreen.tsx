import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
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
  const [resumenVisible, setResumenVisible] = useState(false)
  const esListo = pedido.estado === 'LISTO'
  const subtotal = pedido.subtotal || 0
  const iva = pedido.iva || 0
  const total = pedido.total || 0

  const handleSalir = () => {
    limpiarCarrito()
    navigation.navigate('MainAppBottomTabs')
  }

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <View>
          <AppText style={styles.headerSub}>Sauzal</AppText>
          <AppText variant="bold" style={styles.headerTitle}>Tu orden del pedido</AppText>
        </View>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={s(28)} color="#6B7280" />
        </TouchableOpacity>
      </View>

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
                <Ionicons name="time-outline" size={s(60)} color="#2D3142" style={styles.orbitIcon} />
              </View>
            </>
          )}
        </View>

        <View style={styles.detailsCard}>
          <TouchableOpacity
            style={styles.accordionHeader}
            onPress={() => setResumenVisible(!resumenVisible)}
          >
            <AppText style={styles.accordionTitle}>Lista de orden y precios</AppText>
            <Ionicons
              name={resumenVisible ? 'chevron-up' : 'chevron-down'}
              size={s(20)}
              color="#FFC107"
            />
          </TouchableOpacity>

          {resumenVisible && (
            <>
              {pedido.items?.map((item: any) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.itemCircle}>
                    <Ionicons name="fast-food-outline" size={s(18)} color={AppColors.medGray} />
                  </View>
                  <AppText style={styles.itemName}>{item.producto?.nombre || 'Producto'}</AppText>
                  <AppText variant="bold" style={styles.itemPrice}>
                    {item.cantidad} x ${item.precio?.toFixed(2)}
                  </AppText>
                </View>
              ))}

              <TouchableOpacity style={styles.addMore} onPress={() => navigation.navigate('Home')}>
                <Ionicons name="add-circle-outline" size={s(18)} color="#FFC107" />
                <AppText style={styles.addMoreText}>Agregar más opciones del menú</AppText>
              </TouchableOpacity>
            </>
          )}

          <View style={styles.pricing}>
            <View style={styles.pricingRow}>
              <AppText style={styles.pricingLabel}>Subtotal</AppText>
              <AppText variant="bold" style={styles.pricingValue}>${subtotal.toFixed(2)}</AppText>
            </View>
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
        <AppButton title="Salir" onPress={handleSalir} />
      </View>
    </AppSaveView>
  )
}

export default OrderStatusScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginTop: vs(8),
    marginBottom: vs(16),
  },
  backButton: {
    width: s(44), height: s(44), borderRadius: s(12),
    backgroundColor: AppColors.white,
    borderWidth: 1, borderColor: '#F0F0F0',
    alignItems: 'center', justifyContent: 'center',
  },
  headerSub: { fontSize: s(12), color: AppColors.medGray },
  headerTitle: { fontSize: s(18), color: '#2D3142' },
  statusCard: {
    backgroundColor: AppColors.white,
    borderRadius: s(24),
    padding: s(20),
    alignItems: 'center',
    marginBottom: vs(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  statusLabel: { fontSize: s(14), color: '#6B7280', marginBottom: vs(4) },
  statusTime: { fontSize: s(24), color: '#FBBF24', marginBottom: vs(16) },
  statusDisfruta: { fontSize: s(24), color: '#FFC107', marginBottom: vs(24) },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: s(160), height: s(160),
  },
  mascotBg: {
    ...StyleSheet.absoluteFillObject, borderRadius: s(80),
    backgroundColor: '#FFC107', opacity: 0.2,
    transform: [{ scale: 0.9 }],
  },
  orbitContainer: {
    height: vs(240),
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  orbitCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  orbitDot: {
    position: 'absolute',
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: '#FBBF24',
  },
  orbitIcon: { zIndex: 2 },
  detailsCard: {
    backgroundColor: AppColors.white,
    borderRadius: s(24),
    padding: s(20),
    marginBottom: vs(16),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: { fontSize: s(14), color: '#6B7280' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  itemCircle: {
    width: s(40), height: s(40), borderRadius: s(20),
    backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
    marginRight: s(12),
  },
  itemName: { flex: 1, fontSize: s(13), color: '#1F2937' },
  itemPrice: { fontSize: s(13), color: '#1F2937' },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
    gap: s(6),
  },
  addMoreText: { fontSize: s(13), color: '#FFC107', fontWeight: '700' },
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
