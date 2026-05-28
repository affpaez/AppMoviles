import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../store/authStore'
import { obtenerPedidosPorUsuarioService } from '../../services/pedidos.service'

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: '#FBBF24',
  PREPARANDO: '#3B82F6',
  LISTO: '#10B981',
  ENTREGADO: '#6B7280',
  CANCELADO: '#EF4444',
}

const OrdersScreen = () => {
  const navigation = useNavigation<any>()
  const { usuario } = useAuthStore()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (usuario?.id) {
      obtenerPedidosPorUsuarioService(usuario.id)
        .then(setPedidos)
        .catch(() => {})
        .finally(() => setCargando(false))
    }
  }, [usuario])

  const renderPedido = ({ item }: { item: any }) => (
    <View style={styles.pedidoCard}>
      <View style={styles.pedidoHeader}>
        <AppText style={styles.pedidoFecha}>
          {new Date(item.creadoEn).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
        </AppText>
        <View style={[styles.estadoBadge, { backgroundColor: ESTADO_COLORS[item.estado] || '#6B7280' }]}>
          <AppText style={styles.estadoTexto}>{item.estado}</AppText>
        </View>
      </View>
      <View style={styles.pedidoItems}>
        {item.items?.slice(0, 3).map((i: any) => (
          <AppText key={i.id} style={styles.pedidoItemText}>{i.cantidad}x {i.producto?.nombre}</AppText>
        ))}
        {item.items?.length > 3 && <AppText style={styles.pedidoItemText}>y {item.items.length - 3} más...</AppText>}
      </View>
      <View style={styles.pedidoTotal}>
        <AppText variant="bold" style={styles.totalLabel}>Total</AppText>
        <AppText variant="bold" style={styles.totalValor}>${item.total?.toFixed(2)}</AppText>
      </View>
    </View>
  )

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>Mis pedidos</AppText>
      </View>

      {cargando ? (
        <View style={styles.empty}><AppText>Cargando...</AppText></View>
      ) : pedidos.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="receipt-outline" size={s(60)} color={AppColors.medGray} />
          <AppText style={styles.emptyText}>No tienes pedidos aún</AppText>
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id}
          renderItem={renderPedido}
          showsVerticalScrollIndicator={false}
        />
      )}
    </AppSaveView>
  )
}

export default OrdersScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(20), gap: s(12) },
  backButton: { width: s(44), height: s(44), borderRadius: s(14), backgroundColor: AppColors.white, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: s(14), color: AppColors.medGray, marginTop: vs(12) },
  pedidoCard: { backgroundColor: AppColors.white, borderRadius: s(16), padding: s(16), marginBottom: vs(12), borderWidth: 1, borderColor: '#F0F0F0' },
  pedidoHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
  pedidoFecha: { fontSize: s(12), color: AppColors.medGray },
  estadoBadge: { paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: s(10) },
  estadoTexto: { fontSize: s(10), color: AppColors.white, fontWeight: '700' },
  pedidoItems: { marginBottom: vs(8) },
  pedidoItemText: { fontSize: s(13), color: '#374151', marginBottom: vs(2) },
  pedidoTotal: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingTop: vs(8) },
  totalLabel: { fontSize: s(14), color: '#1F2937' },
  totalValor: { fontSize: s(14), color: '#FBBF24' },
})
