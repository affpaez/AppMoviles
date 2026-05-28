import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useCallback, useMemo } from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import SearchBar from '../../components/inputs/SearchBar'
import Carousel from '../../components/home/Carousel'
import CategoryFilters from '../../components/home/CategoryFilters'
import PopularesSection from '../../components/home/PopularesSection'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useProductos } from '../../hooks/useProductos'
import { Producto } from '../../types/types'
import { useNavigation } from '@react-navigation/native'

const ITEM_HEIGHT = 90

const HomeScreen = () => {
  const navigation = useNavigation<any>()
  const { productosDelDia, categorias, populares, productosFiltrados, cargandoMas, cargarMas } = useProductos()
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [carouselIndex, setCarouselIndex] = useState(0)

  const abrirProducto = useCallback((p: Producto) => {
    navigation.navigate('ProductDetailModal', { producto: p })
  }, [navigation])

  const productosVisibles = useMemo(() =>
    productosFiltrados.filter((p) => {
      if (categoriaSeleccionada && p.categoria.id !== categoriaSeleccionada) return false
      if (busqueda && !p.nombre.toLowerCase().includes(busqueda.toLowerCase())) return false
      return true
    }),
    [productosFiltrados, categoriaSeleccionada, busqueda]
  )

  const renderHeader = useCallback(() => (
    <View>
      <AppText variant="bold" style={styles.titulo}>Elige la mejor opción para ti</AppText>
      <Carousel productos={productosDelDia} carouselIndex={carouselIndex} onIndexChange={setCarouselIndex} onPress={abrirProducto} />
      <CategoryFilters categorias={categorias} seleccionada={categoriaSeleccionada} onSelect={setCategoriaSeleccionada} />
      {!categoriaSeleccionada && !busqueda && <PopularesSection productos={populares} onPress={abrirProducto} />}
      <AppText variant="bold" style={styles.seccionTitulo}>
        {categoriaSeleccionada
          ? categorias.find((c) => c.id === categoriaSeleccionada)?.nombre || 'Productos'
          : 'Todos los productos'}
      </AppText>
    </View>
  ), [productosDelDia, categorias, categoriaSeleccionada, busqueda, carouselIndex, populares, abrirProducto])

  const renderProducto = useCallback(({ item }: { item: Producto }) => (
    <TouchableOpacity style={styles.cardProducto} onPress={() => abrirProducto(item)}>
      <AppText variant="bold" style={styles.cardNombre}>{item.nombre}</AppText>
      {item.descripcion && <AppText style={styles.cardDescripcion} numberOfLines={2}>{item.descripcion}</AppText>}
      <View style={styles.cardPrecioRow}>
        <AppText style={styles.cardPrecioSigno}>$</AppText>
        <AppText variant="bold" style={styles.cardPrecio}>{item.precio.toFixed(2)}</AppText>
      </View>
    </TouchableOpacity>
  ), [abrirProducto])

  return (
    <AppSaveView style={styles.container}>
      <SearchBar onSearch={setBusqueda} />
      <FlatList
        data={productosVisibles}
        keyExtractor={(item) => item.id}
        renderItem={renderProducto}
        ListHeaderComponent={renderHeader}
        onEndReached={cargarMas}
        onEndReachedThreshold={0.5}
        getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        initialNumToRender={8}
        ListFooterComponent={cargandoMas ? <View style={styles.loadingFooter}><AppText style={styles.loadingText}>Cargando más productos...</AppText></View> : null}
        showsVerticalScrollIndicator={false}
      />
    </AppSaveView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  titulo: { fontSize: s(22), color: '#2D3142', marginBottom: vs(16), marginTop: vs(8) },
  seccionTitulo: { fontSize: s(16), color: '#9BA1B0', marginBottom: vs(14) },
  cardProducto: {
    backgroundColor: AppColors.white, borderRadius: s(16), padding: s(16),
    marginBottom: vs(10), borderWidth: 1, borderColor: '#F0F0F0', height: ITEM_HEIGHT,
  },
  cardNombre: { fontSize: s(14), marginBottom: vs(4), color: '#2D3142' },
  cardDescripcion: { fontSize: s(12), color: AppColors.medGray, marginBottom: vs(6) },
  cardPrecioRow: { flexDirection: 'row', alignItems: 'baseline' },
  cardPrecioSigno: { fontSize: s(10), color: '#F2C94C', fontWeight: 'bold', marginRight: s(2) },
  cardPrecio: { fontSize: s(14), color: '#2D3142' },
  loadingFooter: { paddingVertical: vs(20), alignItems: 'center' },
  loadingText: { fontSize: s(13), color: AppColors.medGray },
})
