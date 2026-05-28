import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import AppText from '../text/AppText'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { Producto } from '../../types/types'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const PAGE_WIDTH = SCREEN_WIDTH - s(24) * 2

interface Props {
  productos: Producto[]
  carouselIndex: number
  onIndexChange: (index: number) => void
  onPress: (producto: Producto) => void
}

const Carousel = ({ productos, carouselIndex, onIndexChange, onPress }: Props) => {
  if (productos.length === 0) return null

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / PAGE_WIDTH)
          onIndexChange(idx)
        }}
      >
        {productos.map((item) => (
          <View key={item.id} style={styles.page}>
            <TouchableOpacity style={styles.banner} onPress={() => onPress(item)}>
              {item.imagenUrl && <Image source={{ uri: item.imagenUrl }} style={styles.bannerImage} />}
              <View style={styles.content}>
                <AppText style={styles.label}>Producto del día</AppText>
                <AppText variant="bold" style={styles.nombre}>{item.nombre}</AppText>
                <View style={styles.precioRow}>
                  <AppText style={styles.precioSigno}>$</AppText>
                  <AppText variant="bold" style={styles.precio}>{item.precio.toFixed(2)}</AppText>
                </View>
              </View>
              <View style={styles.circle} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      {productos.length > 1 && (
        <View style={styles.dots}>
          {productos.map((_, idx) => (
            <View key={idx} style={[styles.dot, idx === carouselIndex && styles.dotActivo]} />
          ))}
        </View>
      )}
    </View>
  )
}

export default React.memo(Carousel)

const styles = StyleSheet.create({
  container: { marginBottom: vs(16) },
  page: { width: PAGE_WIDTH, paddingRight: s(12) },
  banner: {
    flex: 1, backgroundColor: AppColors.primary, borderRadius: s(32), padding: s(24),
    minHeight: vs(160), justifyContent: 'center', overflow: 'hidden',
  },
  bannerImage: { ...StyleSheet.absoluteFillObject as any, width: undefined, height: undefined, borderRadius: s(32), opacity: 0.25 },
  content: { zIndex: 2 },
  label: { color: AppColors.white, fontSize: s(12), opacity: 0.8, marginBottom: vs(4) },
  nombre: { color: AppColors.white, fontSize: s(20), marginBottom: vs(8) },
  precioRow: { flexDirection: 'row', alignItems: 'baseline' },
  precioSigno: { color: '#F2C94C', fontSize: s(14), fontWeight: 'bold' },
  precio: { color: '#F2C94C', fontSize: s(24) },
  circle: {
    position: 'absolute', right: -20, top: '50%', width: 180, height: 180,
    borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.08)', transform: [{ translateY: -90 }],
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginTop: vs(10), gap: s(6) },
  dot: { width: s(8), height: s(8), borderRadius: s(4), backgroundColor: '#D1D5DB' },
  dotActivo: { backgroundColor: AppColors.primary, width: s(24) },
})
