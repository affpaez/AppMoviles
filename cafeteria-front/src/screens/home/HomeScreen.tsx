import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import {
  obtenerProductosService,
  obtenerProductoDelDiaService,
  obtenerCategoriasService,
} from '../../services/productos.service'
import { Producto, Categoria } from '../../types/types'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productoDelDia, setProductoDelDia] = useState<Producto | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const navigation = useNavigation<any>()

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [prods, delDia, cats] = await Promise.all([
        obtenerProductosService(),
        obtenerProductoDelDiaService(),
        obtenerCategoriasService(),
      ])
      setProductos(prods)
      setProductoDelDia(delDia)
      setCategorias(cats)
    } catch (error) {
      console.log(error)
    }
  }

  const productosFiltrados = productos.filter((p) => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = categoriaSeleccionada
      ? p.categoria.id === categoriaSeleccionada
      : true
    return coincideBusqueda && coincideCategoria
  })

  const populares = productos.filter((p) => p.esPopular)

  return (
    <AppSaveView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Location Header */}
        <View style={styles.locationHeader}>
          <Ionicons name="location-outline" size={s(18)} color={AppColors.medGray} />
          <AppText style={styles.locationText}>Sauzal</AppText>
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu-outline" size={s(24)} color="#2D3142" />
          </TouchableOpacity>
        </View>

        {/* Welcome */}
        <AppText variant="bold" style={styles.titulo}>
          Elige la mejor opción para ti
        </AppText>

        {/* Search Bar */}
        <View style={styles.busquedaContainer}>
          <Ionicons name="search-outline" size={s(18)} color={AppColors.medGray} />
          <TextInput
            placeholder="Search"
            value={busqueda}
            onChangeText={setBusqueda}
            style={styles.inputBusqueda}
            placeholderTextColor={AppColors.medGray}
          />
          <TouchableOpacity onPress={() => navigation.navigate('FiltersScreen')}>
            <Ionicons name="options-outline" size={s(22)} color="#F2C94C" />
          </TouchableOpacity>
        </View>

        {/* Banner producto del día */}
        {productoDelDia && (
          <View style={styles.bannerDelDia}>
            <View style={styles.bannerContent}>
              <AppText style={styles.bannerLabel}>Producto del día</AppText>
              <AppText variant="bold" style={styles.bannerNombre}>
                {productoDelDia.nombre}
              </AppText>
              <View style={styles.bannerPrecioRow}>
                <AppText style={styles.bannerPrecioSigno}>$</AppText>
                <AppText variant="bold" style={styles.bannerPrecio}>
                  {productoDelDia.precio.toFixed(2)}
                </AppText>
              </View>
            </View>
            <View style={styles.bannerCircle} />
          </View>
        )}

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosContainer}
        >
          <TouchableOpacity
            style={[styles.filtroBadge, !categoriaSeleccionada && styles.filtroBadgeActivo]}
            onPress={() => setCategoriaSeleccionada(null)}
          >
            <AppText
              style={[styles.filtroTexto, !categoriaSeleccionada && styles.filtroTextoActivo]}
            >
              Menú
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filtroBadge}
            onPress={() => setCategoriaSeleccionada(null)}
          >
            <AppText style={styles.filtroTexto}>Populares</AppText>
          </TouchableOpacity>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.filtroBadge, categoriaSeleccionada === cat.id && styles.filtroBadgeActivo]}
              onPress={() => setCategoriaSeleccionada(cat.id)}
            >
              <AppText
                style={[styles.filtroTexto, categoriaSeleccionada === cat.id && styles.filtroTextoActivo]}
              >
                {cat.nombre}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Populares */}
        {!categoriaSeleccionada && !busqueda && (
          <View style={styles.seccion}>
            <AppText variant="bold" style={styles.seccionTitulo}>
              Populares
            </AppText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {populares.map((producto) => (
                <TouchableOpacity
                  key={producto.id}
                  style={styles.cardPopular}
                  onPress={() => navigation.navigate('ProductoDetalleScreen', { producto })}
                >
                  <View style={styles.popularImageContainer}>
                    <View style={styles.popularImagePlaceholder}>
                      <Ionicons name="fast-food-outline" size={s(32)} color={AppColors.medGray} />
                    </View>
                  </View>
                  <AppText style={styles.cardNombre} numberOfLines={2}>
                    {producto.nombre}
                  </AppText>
                  <View style={styles.cardPrecioRow}>
                    <AppText style={styles.cardPrecioSigno}>$</AppText>
                    <AppText variant="bold" style={styles.cardPrecio}>
                      {producto.precio.toFixed(2)}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Lista de productos */}
        <View style={styles.seccion}>
          <AppText variant="bold" style={styles.seccionTitulo}>
            {categoriaSeleccionada
              ? categorias.find((c) => c.id === categoriaSeleccionada)?.nombre
              : 'Todos los productos'}
          </AppText>
          {productosFiltrados.map((producto) => (
            <TouchableOpacity
              key={producto.id}
              style={styles.cardProducto}
              onPress={() => navigation.navigate('ProductoDetalleScreen', { producto })}
            >
              <View style={styles.cardProductoInfo}>
                <AppText variant="bold" style={styles.cardNombre}>
                  {producto.nombre}
                </AppText>
                {producto.descripcion && (
                  <AppText style={styles.cardDescripcion} numberOfLines={2}>
                    {producto.descripcion}
                  </AppText>
                )}
                <View style={styles.cardPrecioRow}>
                  <AppText style={styles.cardPrecioSigno}>$</AppText>
                  <AppText variant="bold" style={styles.cardPrecio}>
                    {producto.precio.toFixed(2)}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </AppSaveView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sharedPaddingHorizontal,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    marginBottom: vs(12),
  },
  locationText: {
    fontSize: s(14),
    color: AppColors.medGray,
    marginLeft: s(6),
    flex: 1,
  },
  menuButton: {
    padding: s(4),
  },
  titulo: {
    fontSize: s(22),
    color: '#2D3142',
    marginBottom: vs(16),
  },
  busquedaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: s(16),
    paddingHorizontal: s(16),
    height: vs(48),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  inputBusqueda: {
    flex: 1,
    marginLeft: s(8),
    fontSize: s(14),
    color: AppColors.black,
  },
  bannerDelDia: {
    backgroundColor: AppColors.primary,
    borderRadius: s(32),
    padding: s(20),
    marginBottom: vs(20),
    minHeight: vs(160),
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    zIndex: 2,
  },
  bannerLabel: {
    color: AppColors.white,
    fontSize: s(12),
    opacity: 0.8,
    marginBottom: vs(4),
  },
  bannerNombre: {
    color: AppColors.white,
    fontSize: s(20),
    marginBottom: vs(8),
  },
  bannerPrecioRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  bannerPrecioSigno: {
    color: '#F2C94C',
    fontSize: s(14),
    fontWeight: 'bold',
  },
  bannerPrecio: {
    color: '#F2C94C',
    fontSize: s(24),
  },
  bannerCircle: {
    position: 'absolute',
    right: -20,
    top: '50%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: [{ translateY: -90 }],
  },
  filtrosContainer: {
    marginBottom: vs(16),
    flexGrow: 0,
  },
  filtroBadge: {
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    borderRadius: s(16),
    backgroundColor: AppColors.white,
    marginRight: s(10),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  filtroBadgeActivo: {
    backgroundColor: '#F2C94C',
    borderColor: '#F2C94C',
  },
  filtroTexto: {
    fontSize: s(13),
    color: '#9BA1B0',
    fontWeight: '500',
  },
  filtroTextoActivo: {
    color: AppColors.white,
    fontWeight: '700',
  },
  seccion: {
    marginBottom: vs(20),
  },
  seccionTitulo: {
    fontSize: s(16),
    color: '#9BA1B0',
    marginBottom: vs(14),
  },
  horizontalScroll: {
    flexGrow: 0,
  },
  cardPopular: {
    backgroundColor: AppColors.white,
    borderRadius: s(32),
    padding: s(16),
    marginRight: s(16),
    width: s(160),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  popularImageContainer: {
    marginBottom: vs(12),
  },
  popularImagePlaceholder: {
    width: s(100),
    height: s(100),
    borderRadius: s(50),
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardProducto: {
    backgroundColor: AppColors.white,
    borderRadius: s(16),
    padding: s(16),
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardProductoInfo: {
    flex: 1,
  },
  cardNombre: {
    fontSize: s(14),
    marginBottom: vs(4),
    color: '#2D3142',
  },
  cardDescripcion: {
    fontSize: s(12),
    color: AppColors.medGray,
    marginBottom: vs(6),
  },
  cardPrecioRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  cardPrecioSigno: {
    fontSize: s(10),
    color: '#F2C94C',
    fontWeight: 'bold',
    marginRight: s(2),
  },
  cardPrecio: {
    fontSize: s(14),
    color: '#2D3142',
  },
})
