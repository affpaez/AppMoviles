import { StyleSheet, View, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useCartStore } from '../../store/cartStore'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Extra } from '../../types/types'

const ProductDetailModalScreen = () => {
  const navigation = useNavigation<any>()
  const route = useRoute<any>()
  const producto = route.params?.producto
  const { agregarItem } = useCartStore()

  const [cantidad, setCantidad] = useState(1)
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<Extra[]>([])
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    setCantidad(1)
    setExtrasSeleccionados([])
    setComentario('')
  }, [producto])

  const toggleExtra = (extra: Extra) => {
    const existe = extrasSeleccionados.find((e) => e.id === extra.id)
    if (existe) setExtrasSeleccionados(extrasSeleccionados.filter((e) => e.id !== extra.id))
    else setExtrasSeleccionados([...extrasSeleccionados, extra])
  }

  const handleAgregar = () => {
    if (!producto) return
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
  const totalFinal = producto ? (producto.precio + totalExtras) * cantidad : 0

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.overlayBg} onPress={() => navigation.goBack()} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        {producto && (
          <>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
              {producto.imagenUrl && <Image source={{ uri: producto.imagenUrl }} style={styles.image} />}
              <View style={styles.header}>
                <AppText variant="bold" style={styles.nombre}>{producto.nombre}</AppText>
                <AppText variant="bold" style={styles.precio}>${producto.precio.toFixed(2)}</AppText>
              </View>
              {producto.descripcion && <AppText style={styles.descripcion}>{producto.descripcion}</AppText>}

              {producto.calorias && (
                <View style={styles.nutricionContainer}>
                  {[{ label: 'kcal', v: producto.calorias }, { label: 'gramos', v: producto.gramos }, { label: 'proteínas', v: producto.proteinas }, { label: 'carbs', v: producto.carbohidratos }, { label: 'grasas', v: producto.grasas }].map((n) => (
                    <View key={n.label} style={styles.nutricionItem}>
                      <AppText variant="bold" style={styles.nutricionValor}>{n.v}</AppText>
                      <AppText style={styles.nutricionLabel}>{n.label}</AppText>
                    </View>
                  ))}
                </View>
              )}

              {producto.ingredientes?.length > 0 && (
                <View style={styles.section}>
                  <AppText variant="bold" style={styles.sectionTitulo}>Ingredientes</AppText>
                  <View style={styles.ingredientesContainer}>
                    {producto.ingredientes.map((ing: any) => (
                      <View key={ing.id} style={styles.ingredienteItem}><AppText style={styles.ingredienteNombre}>{ing.nombre}</AppText></View>
                    ))}
                  </View>
                </View>
              )}

              {producto.extras?.length > 0 && (
                <View style={styles.section}>
                  <AppText variant="bold" style={styles.sectionTitulo}>Agregar extras</AppText>
                  {producto.extras.map((extra: any) => {
                    const sel = extrasSeleccionados.find((e) => e.id === extra.id)
                    return (
                      <TouchableOpacity key={extra.id} style={styles.extraItem} onPress={() => toggleExtra(extra)}>
                        <View style={[styles.checkbox, sel && styles.checkboxActivo]}>
                          {sel && <Ionicons name="checkmark" size={s(12)} color={AppColors.white} />}
                        </View>
                        <AppText style={styles.extraNombre}>{extra.nombre}</AppText>
                        <AppText variant="bold" style={styles.extraPrecio}>${extra.precio.toFixed(2)}</AppText>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              )}

              <View style={styles.section}>
                <AppText variant="bold" style={styles.sectionTitulo}>Agregar comentario</AppText>
                <TextInput placeholder="Ej. No agregar cebolla" value={comentario} onChangeText={setComentario} style={styles.inputComentario} placeholderTextColor={AppColors.medGray} maxLength={259} multiline />
                <AppText style={styles.contadorComentario}>{comentario.length}/259</AppText>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.cantidadContainer}>
                <TouchableOpacity onPress={() => setCantidad(Math.max(1, cantidad - 1))} style={styles.cantidadBoton}>
                  <AppText variant="bold" style={styles.cantidadTexto}>—</AppText>
                </TouchableOpacity>
                <AppText variant="bold" style={styles.cantidadNumero}>{cantidad}</AppText>
                <TouchableOpacity onPress={() => setCantidad(cantidad + 1)} style={styles.cantidadBoton}>
                  <AppText variant="bold" style={styles.cantidadTexto}>+</AppText>
                </TouchableOpacity>
              </View>
              <AppButton title={`Agregar $${totalFinal.toFixed(2)}`} onPress={handleAgregar} style={{ flex: 1 }} />
            </View>
          </>
        )}
      </View>
    </View>
  )
}

export default ProductDetailModalScreen

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  overlayBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: s(32), borderTopRightRadius: s(32), maxHeight: '90%' },
  handle: { width: s(40), height: s(5), backgroundColor: '#D1D5DB', borderRadius: s(3), alignSelf: 'center', marginTop: vs(12), marginBottom: vs(8) },
  scroll: { paddingHorizontal: sharedPaddingHorizontal },
  image: { width: '100%', height: vs(180), borderRadius: s(16), marginBottom: vs(12) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8) },
  nombre: { fontSize: s(20), flex: 1 },
  precio: { fontSize: s(20), color: AppColors.primary },
  descripcion: { color: AppColors.medGray, fontSize: s(13), marginBottom: vs(16) },
  section: { marginBottom: vs(16) },
  sectionTitulo: { fontSize: s(16), marginBottom: vs(10) },
  nutricionContainer: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', borderRadius: s(12), padding: s(12), marginBottom: vs(16), borderWidth: 1, borderColor: '#F0F0F0' },
  nutricionItem: { alignItems: 'center' },
  nutricionValor: { fontSize: s(14) },
  nutricionLabel: { fontSize: s(11), color: AppColors.medGray },
  ingredientesContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  ingredienteItem: { backgroundColor: '#fff', borderRadius: s(10), padding: s(10), borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', minWidth: s(70) },
  ingredienteNombre: { fontSize: s(12), marginTop: vs(4) },
  extraItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: s(10), padding: s(12), marginBottom: vs(8), borderWidth: 1, borderColor: '#F0F0F0' },
  checkbox: { width: s(20), height: s(20), borderRadius: s(4), borderWidth: 1, borderColor: '#ccc', marginRight: s(10), alignItems: 'center', justifyContent: 'center' },
  checkboxActivo: { backgroundColor: AppColors.primary, borderColor: AppColors.primary },
  extraNombre: { flex: 1, fontSize: s(13) },
  extraPrecio: { fontSize: s(13), color: AppColors.primary },
  inputComentario: { backgroundColor: '#fff', borderRadius: s(12), borderWidth: 1, borderColor: '#F0F0F0', padding: s(12), fontSize: s(13), minHeight: vs(60), color: '#000' },
  contadorComentario: { textAlign: 'right', fontSize: s(11), color: AppColors.medGray, marginTop: vs(4) },
  footer: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12), paddingHorizontal: sharedPaddingHorizontal, gap: s(12), backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  cantidadContainer: { flexDirection: 'row', alignItems: 'center', gap: s(12) },
  cantidadBoton: { width: s(28), height: s(28), borderRadius: s(14), borderWidth: 1, borderColor: '#ccc', alignItems: 'center', justifyContent: 'center' },
  cantidadTexto: { fontSize: s(14) },
  cantidadNumero: { fontSize: s(16), minWidth: s(20), textAlign: 'center' },
})
