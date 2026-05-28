import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { useCartStore } from '../../store/cartStore'
import { IVA } from '../../constants/constants'

const OrderStatusScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { pedido } = route.params
  const { limpiarCarrito } = useCartStore()
  const [resumenVisible, setResumenVisible] = useState(false)

  const subtotal = pedido.subtotal
  const iva = pedido.iva
  const total = pedido.total

  const handleSalir = () => {
    limpiarCarrito()
    navigation.navigate('MainAppBottomTabs')
  }

  return (
    <AppSaveView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Estado */}
        <View style={styles.estadoContainer}>
          {pedido.estado === 'LISTO' ? (
            <>
              <AppText style={styles.estadoTexto}>Tu comida está lista</AppText>
              <AppText variant="bold" style={styles.estadoDisfruta}>
                ¡Disfruta!
              </AppText>
            </>
          ) : (
            <>
              <AppText style={styles.estadoTexto}>
                Tu orden estará lista en:
              </AppText>
              <AppText variant="bold" style={styles.estadoTiempo}>
                {pedido.tiempoEstimado ?? 10} minutos
              </AppText>
            </>
          )}

          {/* Círculo animado */}
          <View style={styles.circuloContainer}>
            <View style={styles.circuloExterno}>
              <View style={styles.circuloInterno}>
                <Ionicons
                  name="checkmark-circle"
                  size={s(80)}
                  color={AppColors.primary}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Resumen de orden */}
        <View style={styles.resumenContainer}>
          <TouchableOpacity
            style={styles.resumenHeader}
            onPress={() => setResumenVisible(!resumenVisible)}
          >
            <AppText variant="bold" style={styles.resumenTitulo}>
              Lista de orden y precios
            </AppText>
            <Ionicons
              name={resumenVisible ? 'chevron-up' : 'chevron-down'}
              size={s(18)}
              color={AppColors.primary}
            />
          </TouchableOpacity>

          {resumenVisible && (
            <>
              {pedido.items.map((item: any) => (
                <View key={item.id} style={styles.resumenItem}>
                  <AppText style={styles.resumenItemNombre}>
                    {item.producto.nombre}
                  </AppText>
                  <AppText variant="bold">
                    {item.cantidad} x ${item.precio.toFixed(2)}
                  </AppText>
                </View>
              ))}

              <TouchableOpacity
                style={styles.agregarMas}
                onPress={() => navigation.navigate('Home')}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={s(16)}
                  color={AppColors.primary}
                />
                <AppText style={styles.agregarMasTexto}>
                  Agregar más opciones del menú
                </AppText>
              </TouchableOpacity>
            </>
          )}

          {/* Totales */}
          <View style={styles.totalesContainer}>
            <View style={styles.totalFila}>
              <AppText style={styles.totalLabel}>Subtotal</AppText>
              <AppText variant="bold">${subtotal.toFixed(2)}</AppText>
            </View>
            <View style={styles.totalFila}>
              <AppText style={styles.totalLabel}>IVA (8%)</AppText>
              <AppText variant="bold">${iva.toFixed(2)}</AppText>
            </View>
            <View style={[styles.totalFila, styles.totalFinal]}>
              <AppText variant="bold" style={styles.totalFinalLabel}>
                Total
              </AppText>
              <AppText variant="bold" style={styles.totalFinalValor}>
                ${total.toFixed(2)}
              </AppText>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <AppButton
          title="Salir"
          onPress={handleSalir}
        />
      </View>

    </AppSaveView>
  )
}

export default OrderStatusScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sharedPaddingHorizontal,
  },
  estadoContainer: {
    alignItems: 'center',
    paddingVertical: vs(32),
  },
  estadoTexto: {
    fontSize: s(16),
    color: AppColors.medGray,
    marginBottom: vs(4),
  },
  estadoTiempo: {
    fontSize: s(22),
    color: AppColors.yellow,
    marginBottom: vs(24),
  },
  estadoDisfruta: {
    fontSize: s(22),
    color: AppColors.yellow,
    marginBottom: vs(24),
  },
  circuloContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circuloExterno: {
    width: s(180),
    height: s(180),
    borderRadius: s(90),
    borderWidth: 1,
    borderColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.3,
  },
  circuloInterno: {
    width: s(140),
    height: s(140),
    borderRadius: s(70),
    borderWidth: 1,
    borderColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resumenContainer: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(16),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    marginBottom: vs(16),
  },
  resumenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  resumenTitulo: {
    fontSize: s(14),
  },
  resumenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
  },
  resumenItemNombre: {
    fontSize: s(13),
    flex: 1,
  },
  agregarMas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingVertical: vs(12),
  },
  agregarMasTexto: {
    color: AppColors.primary,
    fontSize: s(13),
  },
  totalesContainer: {
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingTop: vs(12),
  },
  totalFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  totalLabel: {
    color: AppColors.medGray,
  },
  totalFinal: {
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingTop: vs(8),
    marginBottom: 0,
  },
  totalFinalLabel: {
    fontSize: s(16),
  },
  totalFinalValor: {
    fontSize: s(16),
    color: AppColors.primary,
  },
  footer: {
    paddingVertical: vs(12),
  },
})