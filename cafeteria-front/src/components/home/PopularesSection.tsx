import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import AppText from '../text/AppText'
import { Ionicons } from '@expo/vector-icons'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { Producto } from '../../types/types'

interface Props {
  productos: Producto[]
  onPress: (producto: Producto) => void
}

const PopularesSection = ({ productos, onPress }: Props) => {
  if (productos.length === 0) return null

  return (
    <View style={styles.seccion}>
      <AppText variant="bold" style={styles.titulo}>Populares</AppText>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {productos.map((producto) => (
          <TouchableOpacity key={producto.id} style={styles.card} onPress={() => onPress(producto)}>
            <View style={styles.imageContainer}>
              {producto.imagenUrl ? (
                <Image source={{ uri: producto.imagenUrl }} style={styles.image} />
              ) : (
                <View style={styles.placeholder}>
                  <Ionicons name="fast-food-outline" size={s(28)} color={AppColors.medGray} />
                </View>
              )}
            </View>
            <AppText style={styles.nombre} numberOfLines={2}>{producto.nombre}</AppText>
            <AppText style={styles.precio}>${producto.precio.toFixed(2)}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

export default React.memo(PopularesSection)

const styles = StyleSheet.create({
  seccion: { marginBottom: vs(20) },
  titulo: { fontSize: s(16), color: '#9BA1B0', marginBottom: vs(14) },
  scroll: { flexGrow: 0 },
  card: {
    backgroundColor: '#fff', borderRadius: s(16), padding: s(12),
    marginRight: s(12), width: s(130),
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, shadowRadius: 20, elevation: 4,
  },
  imageContainer: { marginBottom: vs(8), alignItems: 'center' },
  placeholder: { width: s(80), height: s(80), borderRadius: s(40), backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' },
  image: { width: s(80), height: s(80), borderRadius: s(40) },
  nombre: { fontSize: s(12), color: '#2D3142', marginBottom: vs(4), textAlign: 'center' },
  precio: { fontSize: s(14), color: '#F2C94C', fontWeight: '700', textAlign: 'center' },
})
