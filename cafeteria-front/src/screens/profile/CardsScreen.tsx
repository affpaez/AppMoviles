import { StyleSheet, View, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { listarTarjetasService, eliminarTarjetaService } from '../../services/tarjetas.service'
import { Tarjeta } from '../../types/types'
import { showMessage } from 'react-native-flash-message'

const CardsScreen = () => {
  const navigation = useNavigation<any>()
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [cargando, setCargando] = useState(true)

  const cargar = () => {
    listarTarjetasService()
      .then(setTarjetas)
      .catch(() => {})
      .finally(() => setCargando(false))
  }

  useEffect(() => { cargar() }, [])

  const handleEliminar = (id: string) => {
    Alert.alert('Eliminar tarjeta', '¿Estás seguro de eliminar esta tarjeta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive',
        onPress: async () => {
          try {
            await eliminarTarjetaService(id)
            showMessage({ message: 'Tarjeta eliminada', type: 'success' })
            cargar()
          } catch { showMessage({ message: 'Error al eliminar', type: 'danger' }) }
        },
      },
    ])
  }

  const renderTarjeta = ({ item }: { item: Tarjeta }) => (
    <View style={styles.card}>
      <View style={styles.cardActions}>
        {item.pagoPorDefecto && (
          <View style={styles.defectoBadge}>
            <AppText style={styles.defectoTexto}>Por defecto</AppText>
          </View>
        )}
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleEliminar(item.id)}>
          <Ionicons name="trash-outline" size={s(18)} color="#EF4444" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardBrandRow}>
        <View style={[styles.brandDot, { backgroundColor: '#EB001B' }]} />
        <View style={[styles.brandDot, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
      </View>
      <AppText style={styles.cardNumber}>**** **** **** {item.ultimosDigitos}</AppText>
      <View style={styles.cardFooter}>
        <AppText style={styles.cardName}>{item.nombreTitular}</AppText>
        <AppText style={styles.cardExp}>{item.fechaExp}</AppText>
      </View>
    </View>
  )

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>Mis tarjetas</AppText>
      </View>

      {cargando ? (
        <View style={styles.empty}><AppText>Cargando...</AppText></View>
      ) : tarjetas.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="card-outline" size={s(60)} color={AppColors.medGray} />
          <AppText style={styles.emptyText}>No tienes tarjetas guardadas</AppText>
        </View>
      ) : (
        <FlatList
          data={tarjetas}
          keyExtractor={(item) => item.id}
          renderItem={renderTarjeta}
          showsVerticalScrollIndicator={false}
        />
      )}
    </AppSaveView>
  )
}

export default CardsScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(20), gap: s(12) },
  backButton: { width: s(44), height: s(44), borderRadius: s(14), backgroundColor: AppColors.white, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: s(14), color: AppColors.medGray, marginTop: vs(12) },
  card: { backgroundColor: '#2D2E3E', borderRadius: s(20), padding: s(20), marginBottom: vs(14), overflow: 'hidden' },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(12) },
  cardBrandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: vs(16) },
  brandDot: { width: s(22), height: s(22), borderRadius: s(11), opacity: 0.9 },
  defectoBadge: { backgroundColor: '#FBBF24', paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: s(8) },
  defectoTexto: { fontSize: s(10), color: '#1F2937', fontWeight: '700' },
  cardNumber: { fontSize: s(16), color: AppColors.white, letterSpacing: 3, marginBottom: vs(16) },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardName: { fontSize: s(12), color: 'rgba(255,255,255,0.7)' },
  cardExp: { fontSize: s(12), color: 'rgba(255,255,255,0.7)' },
  deleteBtn: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: s(16), padding: s(6) },
})
