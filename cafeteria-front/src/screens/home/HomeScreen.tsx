import { StyleSheet, View, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { Ionicons } from '@expo/vector-icons'
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

        {/* Header */}
        <View style={styles.header}>
          <AppText variant="bold" style={styles.titulo}>
            Elige la mejor opción para ti
          </AppText>
        </View>

        {/* Barra de búsqueda */}
        <View style={styles.busquedaContainer}>
          <Ionicons name="search-outline" size={s(18)} color={AppColors.medGray} />
          <TextInput
            placeholder="Search"
            value={busqueda}
            onChangeText={setBusqueda}
            style={styles.inputBusqueda}
            placeholderTextColor={AppColors.medGray}
          />
        </View>

        {/* Banner producto del día */}
        {productoDelDia && (
          <View style={styles.bannerDelDia}>
            <View>
              <AppText style={styles.bannerLabel}>Producto del día</AppText>
              <AppText variant="bold" style={styles.bannerNombre}>
                {productoDelDia.nombre}
              </AppText>
              <AppText variant="bold" style={styles.bannerPrecio}>
                ${productoDelDia.precio.toFixed(2)}
              </AppText>
            </View>
          </View>
        )}

        {/* Filtros por categoría */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtrosContainer}
        >
          <TouchableOpacity
            style={[
              styles.filtroBadge,
              !categoriaSeleccionada && styles.filtroBadgeActivo,
            ]}
            onPress={() => setCategoriaSeleccionada(null)}
          >
            <AppText
              style={[
                styles.filtroTexto,
                !categoriaSeleccionada && styles.filtroTextoActivo,
              ]}
            >
              Menú
            </AppText>
          </TouchableOpacity>

          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filtroBadge,
                categoriaSeleccionada === cat.id && styles.filtroBadgeActivo,
              ]}
              onPress={() => setCategoriaSeleccionada(cat.id)}
            >
              <AppText
                style={[
                  styles.filtroTexto,
                  categoriaSeleccionada === cat.id && styles.filtroTextoActivo,
                ]}
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {populares.map((producto) => (
                <TouchableOpacity key={producto.id} style={styles.cardPopular}
                onPress={() => navigation.navigate('ProductoDetalleScreen', { producto })}
                >
                  <AppText style={styles.cardNombre}>{producto.nombre}</AppText>
                  <AppText variant="bold" style={styles.cardPrecio}>
                    ${producto.precio.toFixed(2)}
                  </AppText>
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
              : 'Todos'}
          </AppText>
          {productosFiltrados.map((producto) => (
            <TouchableOpacity key={producto.id} style={styles.cardProducto}
            onPress={() => navigation.navigate('ProductoDetalleScreen', { producto })}
            >
              <View style={styles.cardProductoInfo}>
                <AppText variant="bold" style={styles.cardNombre}>
                  {producto.nombre}
                </AppText>
                <AppText style={styles.cardDescripcion} numberOfLines={2}>
                  {producto.descripcion}
                </AppText>
                <AppText variant="bold" style={styles.cardPrecio}>
                  ${producto.precio.toFixed(2)}
                </AppText>
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
    paddingHorizontal: sharedPaddingHorizontal,
  },
  header: {
    marginTop: vs(16),
    marginBottom: vs(12),
  },
  titulo: {
    fontSize: s(20),
  },
  busquedaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: s(25),
    paddingHorizontal: s(16),
    height: vs(44),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  inputBusqueda: {
    flex: 1,
    marginLeft: s(8),
    fontSize: s(14),
    color: AppColors.black,
  },
  bannerDelDia: {
    backgroundColor: AppColors.primary,
    borderRadius: s(16),
    padding: s(16),
    marginBottom: vs(16),
  },
  bannerLabel: {
    color: AppColors.white,
    fontSize: s(12),
    opacity: 0.8,
  },
  bannerNombre: {
    color: AppColors.white,
    fontSize: s(18),
    marginVertical: vs(4),
  },
  bannerPrecio: {
    color: AppColors.yellow,
    fontSize: s(20),
  },
  filtrosContainer: {
    marginBottom: vs(16),
  },
  filtroBadge: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(20),
    backgroundColor: AppColors.white,
    marginRight: s(8),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  filtroBadgeActivo: {
    backgroundColor: AppColors.yellow,
    borderColor: AppColors.yellow,
  },
  filtroTexto: {
    fontSize: s(13),
    color: AppColors.black,
  },
  filtroTextoActivo: {
    color: AppColors.black,
  },
  seccion: {
    marginBottom: vs(20),
  },
  seccionTitulo: {
    fontSize: s(16),
    marginBottom: vs(12),
  },
  cardPopular: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginRight: s(12),
    width: s(130),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  cardProducto: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    padding: s(12),
    marginBottom: vs(10),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
  },
  cardProductoInfo: {
    flex: 1,
  },
  cardNombre: {
    fontSize: s(14),
    marginBottom: vs(4),
  },
  cardDescripcion: {
    fontSize: s(12),
    color: AppColors.medGray,
    marginBottom: vs(4),
  },
  cardPrecio: {
    fontSize: s(14),
    color: AppColors.primary,
  },
})