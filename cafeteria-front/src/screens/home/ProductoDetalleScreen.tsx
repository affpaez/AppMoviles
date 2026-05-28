import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
import { Producto, Extra, ItemCarrito } from '../../types/types'
import { useCartStore } from '../../store/cartStore'

const ProductoDetalleScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const { producto } = route.params as { producto: Producto }

  const [cantidad, setCantidad] = useState(1)
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Extra[]>([])
  const [comentario, setComentario] = useState('')
  const { agregarItem }= useCartStore()

  const toggleExtra = (extra: Extra) => {
    const existe = extrasSeleccionados.find((e) => e.id === extra.id)
    if (existe) {
      setExtrasSeleccionados(extrasSeleccionados.filter((e) => e.id !== extra.id))
    } else {
      setExtrasSeleccionados([...extrasSeleccionados, extra])
    }
  }

  const handleAgregar = () => {
    agregarItem({
      producto,
      cantidad,
      precio: producto.precio,
      comentario,
      extras: extrasSeleccionados,
    })
    navigation.goBack()
  }

  const totalExtras = extrasSeleccionados.reduce((acc, e) => acc + e.precio, 0)
  const totalFinal = (producto.precio + totalExtras) * cantidad

  return (
    <AppSaveView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botonVolver}>
          <Ionicons name="arrow-back" size={s(22)} color={AppColors.black} />
        </TouchableOpacity>

        {/* Nombre y precio */}
        <View style={styles.encabezado}>
          <AppText variant="bold" style={styles.nombre}>
            {producto.nombre}
          </AppText>
          <AppText variant="bold" style={styles.precio}>
            ${producto.precio.toFixed(2)}
          </AppText>
        </View>

        {/* Descripción */}
        {producto.descripcion && (
          <AppText style={styles.descripcion}>{producto.descripcion}</AppText>
        )}

        {/* Info nutricional */}
        {producto.calorias && (
          <View style={styles.nutricionContainer}>
            <View style={styles.nutricionItem}>
              <AppText variant="bold" style={styles.nutricionValor}>
                {producto.calorias}
              </AppText>
              <AppText style={styles.nutricionLabel}>kcal</AppText>
            </View>
            <View style={styles.nutricionItem}>
              <AppText variant="bold" style={styles.nutricionValor}>
                {producto.gramos}
              </AppText>
              <AppText style={styles.nutricionLabel}>gramos</AppText>
            </View>
            <View style={styles.nutricionItem}>
              <AppText variant="bold" style={styles.nutricionValor}>
                {producto.proteinas}
              </AppText>
              <AppText style={styles.nutricionLabel}>proteínas</AppText>
            </View>
            <View style={styles.nutricionItem}>
              <AppText variant="bold" style={styles.nutricionValor}>
                {producto.carbohidratos}
              </AppText>
              <AppText style={styles.nutricionLabel}>carbs</AppText>
            </View>
            <View style={styles.nutricionItem}>
              <AppText variant="bold" style={styles.nutricionValor}>
                {producto.grasas}
              </AppText>
              <AppText style={styles.nutricionLabel}>grasas</AppText>
            </View>
          </View>
        )}

        {/* Ingredientes */}
        {producto.ingredientes?.length > 0 && (
          <View style={styles.seccion}>
            <AppText variant="bold" style={styles.seccionTitulo}>
              Ingredientes
            </AppText>
            <View style={styles.ingredientesContainer}>
              {producto.ingredientes.map((ing) => (
                <View key={ing.id} style={styles.ingredienteItem}>
                  <AppText style={styles.ingredienteNombre}>{ing.nombre}</AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Extras */}
        {producto.extras?.length > 0 && (
          <View style={styles.seccion}>
            <AppText variant="bold" style={styles.seccionTitulo}>
              Agregar extras
            </AppText>
            {producto.extras.map((extra) => {
              const seleccionado = extrasSeleccionados.find((e) => e.id === extra.id)
              return (
                <TouchableOpacity
                  key={extra.id}
                  style={styles.extraItem}
                  onPress={() => toggleExtra(extra)}
                >
                  <View style={[styles.checkbox, seleccionado && styles.checkboxActivo]}>
                    {seleccionado && (
                      <Ionicons name="checkmark" size={s(12)} color={AppColors.white} />
                    )}
                  </View>
                  <AppText style={styles.extraNombre}>{extra.nombre}</AppText>
                  <AppText variant="bold" style={styles.extraPrecio}>
                    ${extra.precio.toFixed(2)}
                  </AppText>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {/* Comentario */}
        <View style={styles.seccion}>
          <AppText variant="bold" style={styles.seccionTitulo}>
            Agregar comentario
          </AppText>
          <TextInput
            placeholder="Ej. No agregar cebolla"
            value={comentario}
            onChangeText={setComentario}
            style={styles.inputComentario}
            placeholderTextColor={AppColors.medGray}
            maxLength={259}
            multiline
          />
          <AppText style={styles.contadorComentario}>{comentario.length}/259</AppText>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.cantidadContainer}>
          <TouchableOpacity
            onPress={() => setCantidad(Math.max(1, cantidad - 1))}
            style={styles.cantidadBoton}
          >
            <AppText variant="bold" style={styles.cantidadTexto}>—</AppText>
          </TouchableOpacity>
          <AppText variant="bold" style={styles.cantidadNumero}>
            {cantidad}
          </AppText>
          <TouchableOpacity
            onPress={() => setCantidad(cantidad + 1)}
            style={styles.cantidadBoton}
          >
            <AppText variant="bold" style={styles.cantidadTexto}>+</AppText>
          </TouchableOpacity>
        </View>

        <AppButton
          title={`Agregar $${totalFinal.toFixed(2)}`}
          onPress={handleAgregar}
          style={styles.botonAgregar}
        />
      </View>
    </AppSaveView>
  )
}

export default ProductoDetalleScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  botonVolver: {
    padding: s(16),
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: sharedPaddingHorizontal,
    marginBottom: vs(8),
  },
  nombre: {
    fontSize: s(20),
    flex: 1,
  },
  precio: {
    fontSize: s(20),
    color: AppColors.primary,
  },
  descripcion: {
    paddingHorizontal: sharedPaddingHorizontal,
    color: AppColors.medGray,
    fontSize: s(13),
    marginBottom: vs(16),
  },
  nutricionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginHorizontal: sharedPaddingHorizontal,
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  nutricionItem: {
    alignItems: 'center',
  },
  nutricionValor: {
    fontSize: s(14),
  },
  nutricionLabel: {
    fontSize: s(11),
    color: AppColors.medGray,
  },
  seccion: {
    paddingHorizontal: sharedPaddingHorizontal,
    marginBottom: vs(16),
  },
  seccionTitulo: {
    fontSize: s(16),
    marginBottom: vs(10),
  },
  ingredientesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  ingredienteItem: {
    backgroundColor: AppColors.white,
    borderRadius: s(10),
    padding: s(10),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    alignItems: 'center',
    minWidth: s(70),
  },
  ingredienteNombre: {
    fontSize: s(12),
    marginTop: vs(4),
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: s(10),
    padding: s(12),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  checkbox: {
    width: s(20),
    height: s(20),
    borderRadius: s(4),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    marginRight: s(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActivo: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  extraNombre: {
    flex: 1,
    fontSize: s(13),
  },
  extraPrecio: {
    fontSize: s(13),
    color: AppColors.primary,
  },
  inputComentario: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    padding: s(12),
    fontSize: s(13),
    minHeight: vs(60),
    color: AppColors.black,
  },
  contadorComentario: {
    textAlign: 'right',
    fontSize: s(11),
    color: AppColors.medGray,
    marginTop: vs(4),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sharedPaddingHorizontal,
    paddingVertical: vs(12),
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.borderColor,
    gap: s(12),
  },
  cantidadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  cantidadBoton: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cantidadTexto: {
    fontSize: s(14),
  },
  cantidadNumero: {
    fontSize: s(16),
    minWidth: s(20),
    textAlign: 'center',
  },
  botonAgregar: {
    flex: 1,
  },
})