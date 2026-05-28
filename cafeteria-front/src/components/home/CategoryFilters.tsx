import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import AppText from '../text/AppText'
import { s, vs } from 'react-native-size-matters'
import { Categoria } from '../../types/types'

interface Props {
  categorias: Categoria[]
  seleccionada: string | null
  onSelect: (id: string | null) => void
}

const CategoryFilters = ({ categorias, seleccionada, onSelect }: Props) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
    <TouchableOpacity style={[styles.badge, !seleccionada && styles.activo]} onPress={() => onSelect(null)}>
      <AppText style={[styles.texto, !seleccionada && styles.textoActivo]}>Menú</AppText>
    </TouchableOpacity>
    {categorias.map((cat) => (
      <TouchableOpacity key={cat.id} style={[styles.badge, seleccionada === cat.id && styles.activo]} onPress={() => onSelect(cat.id)}>
        <AppText style={[styles.texto, seleccionada === cat.id && styles.textoActivo]}>{cat.nombre}</AppText>
      </TouchableOpacity>
    ))}
  </ScrollView>
)

export default React.memo(CategoryFilters)

const styles = StyleSheet.create({
  container: { marginBottom: vs(16), flexGrow: 0 },
  badge: {
    paddingHorizontal: s(16), paddingVertical: vs(10), borderRadius: s(16),
    backgroundColor: '#fff', marginRight: s(10), borderWidth: 1, borderColor: '#F0F0F0',
  },
  activo: { backgroundColor: '#F2C94C', borderColor: '#F2C94C' },
  texto: { fontSize: s(13), color: '#9BA1B0', fontWeight: '500' },
  textoActivo: { color: '#fff', fontWeight: '700' },
})
