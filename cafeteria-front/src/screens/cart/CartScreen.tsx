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
import { useCartStore } from '../../store/cartStore'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { IVA } from '../../constants/constants'
import { crearPedidoService } from '../../services/pedidos.service'
import { useAuthStore } from '../../store/authStore'
import { showMessage } from 'react-native-flash-message'

const CartScreen = () => {
  const navigation = useNavigation<any>()
  const { items, eliminarItem, actualizarCantidad, total } = useCartStore()

  const { usuario } = useAuthStore()
  const [enviando, setEnviando] = useState(false)

  const subtotal = total()
  const iva = subtotal * IVA
  const totalFinal = subtotal + iva

    const handleEnviarOrden = async () => {
    try {
      setEnviando(true)
      const pedido = await crearPedidoService({
        usuarioId: usuario?.id,
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precio: item.precio,
          comentario: item.comentario,
          extras: item.extras.map((e) => ({
            extraId: e.id,
            precio: e.precio,
          })),
        })),
      })
      navigation.navigate('OrderStatusScreen', { pedido })
    } catch (error: any) {
      showMessage({
        message: 'Error al enviar el pedido',
        type: 'danger',
      })
    } finally {
      setEnviando(false)
    }
  }

  if (items.length === 0) {
    return (
      <AppSaveView style={styles.containerVacio}>
        <Ionicons name="cart-outline" size={s(80)} color={AppColors.medGray} />
        <AppText variant="bold" style={styles.carritoVacioTitulo}>
          Tu carrito está vacío
        </AppText>
        <AppText style={styles.carritoVacioSubtitulo}>
          Agrega productos desde el menú
        </AppText>
        <AppButton
          title="Ver menú"
          onPress={() => navigation.navigate('Home')}
          style={styles.botonVerMenu}
        />
      </AppSaveView>
    )
  }

  return (
    <AppSaveView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="bold" style={styles.titulo}>
          Tu orden del pedido
        </AppText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Items del carrito */}
        {items.map((item) => (
          <View key={item.producto.id} style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <AppText variant="bold" style={styles.itemNombre}>
                {item.producto.nombre}
              </AppText>
              {item.comentario ? (
                <AppText style={styles.itemComentario}>
                  {item.comentario}
                </AppText>
              ) : null}
              {item.extras.length > 0 && (
                <AppText style={styles.itemExtras}>
                  + {item.extras.map((e) => e.nombre).join(', ')}
                </AppText>
              )}
              <AppText variant="bold" style={styles.itemPrecio}>
                ${item.precio.toFixed(2)}
              </AppText>
            </View>

            <View style={styles.itemAcciones}>
              <TouchableOpacity
                style={styles.cantidadBoton}
                onPress={() => actualizarCantidad(item.producto.id, item.cantidad - 1)}
              >
                {item.cantidad === 1 ? (
                  <Ionicons name="trash-outline" size={s(16)} color={AppColors.white} />
                ) : (
                  <AppText variant="bold" style={styles.cantidadTexto}>—</AppText>
                )}
              </TouchableOpacity>

              <AppText variant="bold" style={styles.cantidadNumero}>
                {item.cantidad}
              </AppText>

              <TouchableOpacity
                style={[styles.cantidadBoton, styles.cantidadBotonAgregar]}
                onPress={() => actualizarCantidad(item.producto.id, item.cantidad + 1)}
              >
                <AppText variant="bold" style={styles.cantidadTexto}>+</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Agregar más */}
        <TouchableOpacity
          style={styles.agregarMas}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="add-circle-outline" size={s(18)} color={AppColors.primary} />
          <AppText style={styles.agregarMasTexto}>
            Agregar más opciones del menú
          </AppText>
        </TouchableOpacity>

        {/* Resumen */}
        <View style={styles.resumen}>
          <View style={styles.resumenFila}>
            <AppText style={styles.resumenLabel}>Subtotal</AppText>
            <AppText variant="bold">${subtotal.toFixed(2)}</AppText>
          </View>
          <View style={styles.resumenFila}>
            <AppText style={styles.resumenLabel}>IVA (8%)</AppText>
            <AppText variant="bold">${iva.toFixed(2)}</AppText>
          </View>
          <View style={[styles.resumenFila, styles.resumenTotal]}>
            <AppText variant="bold" style={styles.totalLabel}>Total</AppText>
            <AppText variant="bold" style={styles.totalValor}>
              ${totalFinal.toFixed(2)}
            </AppText>
          </View>
        </View>

      </ScrollView>

      {/* Botón enviar */}
      <View style={styles.footer}>
        <AppButton
    title="Enviar orden →"
    onPress={handleEnviarOrden}
    disabled={enviando}
  />
      </View>

    </AppSaveView>
  )
}

export default CartScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sharedPaddingHorizontal,
  },
  containerVacio: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: sharedPaddingHorizontal,
  },
  carritoVacioTitulo: {
    fontSize: s(20),
    marginTop: vs(16),
  },
  carritoVacioSubtitulo: {
    color: AppColors.medGray,
    marginTop: vs(8),
    marginBottom: vs(24),
  },
  botonVerMenu: {
    width: '60%',
  },
  header: {
    paddingVertical: vs(16),
  },
  titulo: {
    fontSize: s(20),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  itemInfo: {
    flex: 1,
    marginRight: s(8),
  },
  itemNombre: {
    fontSize: s(14),
    marginBottom: vs(4),
  },
  itemComentario: {
    fontSize: s(12),
    color: AppColors.medGray,
    marginBottom: vs(2),
  },
  itemExtras: {
    fontSize: s(12),
    color: AppColors.primary,
    marginBottom: vs(4),
  },
  itemPrecio: {
    fontSize: s(14),
    color: AppColors.primary,
  },
  itemAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  cantidadBoton: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidadBotonAgregar: {
    backgroundColor: AppColors.yellow,
  },
  cantidadTexto: {
    color: AppColors.white,
    fontSize: s(14),
  },
  cantidadNumero: {
    fontSize: s(16),
    minWidth: s(20),
    textAlign: 'center',
  },
  agregarMas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    paddingVertical: vs(16),
  },
  agregarMasTexto: {
    color: AppColors.primary,
    fontSize: s(14),
  },
  resumen: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(16),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    marginBottom: vs(16),
  },
  resumenFila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  resumenLabel: {
    color: AppColors.medGray,
  },
  resumenTotal: {
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    paddingTop: vs(8),
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: s(16),
  },
  totalValor: {
    fontSize: s(16),
    color: AppColors.primary,
  },
  footer: {
    paddingVertical: vs(12),
  },
})