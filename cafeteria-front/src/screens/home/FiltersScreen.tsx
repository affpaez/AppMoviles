import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'

const categories = ['Comidas', 'Bebidas', 'Postres']
const types = ['Pizza', 'Hamburguesa', 'Ensalada', 'Pollo', 'Asado', 'Desayuno']

const FiltersScreen = () => {
  const [selectedCat, setSelectedCat] = useState('Comidas')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['Ensalada'])
  const [minPrice] = useState(60)
  const [maxPrice] = useState(80)

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.bgOverlay} />
      <View style={styles.sheet}>
        <View style={styles.handle} />

        <AppText variant="bold" style={styles.title}>Filtros</AppText>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Seleccionar categoría</AppText>
          <View style={styles.chips}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, selectedCat === cat && styles.chipActive]}
                onPress={() => setSelectedCat(cat)}
              >
                <AppText style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
                  {cat}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Seleccionar tipo de producto</AppText>
          <View style={styles.chips}>
            {types.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.chip, selectedTypes.includes(type) && styles.chipActive]}
                onPress={() => toggleType(type)}
              >
                <AppText style={[styles.chipText, selectedTypes.includes(type) && styles.chipTextActive]}>
                  {type}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <AppText style={styles.sectionTitle}>Rango de precio</AppText>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderTrack} />
            <View style={[styles.sliderActive, { left: '25%', right: '25%' }]} />
            <View style={[styles.thumb, { left: '25%' }]} />
            <View style={[styles.thumb, { left: '75%' }]} />
          </View>
          <View style={styles.priceLabels}>
            <AppText style={styles.priceLabel}>50</AppText>
            <AppText style={[styles.priceLabel, styles.priceLabelActive]}>60</AppText>
            <AppText style={styles.priceLabel}>70</AppText>
            <AppText style={[styles.priceLabel, styles.priceLabelActive]}>80</AppText>
            <AppText style={styles.priceLabel}>90</AppText>
          </View>
        </View>

        <View style={styles.footer}>
          <AppButton title="Filtrar" onPress={() => {}} />
        </View>
      </View>
    </View>
  )
}

export default FiltersScreen

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  bgOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  sheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: s(40),
    borderTopRightRadius: s(40),
    padding: s(24),
    paddingBottom: vs(40),
    maxHeight: '85%',
  },
  handle: {
    width: s(40),
    height: s(5),
    backgroundColor: '#D1D5DB',
    borderRadius: s(3),
    alignSelf: 'center',
    marginBottom: vs(20),
  },
  title: {
    fontSize: s(18),
    textAlign: 'center',
    color: '#374151',
    marginBottom: vs(24),
  },
  section: { marginBottom: vs(24) },
  sectionTitle: { fontSize: s(14), color: '#6B7280', marginBottom: vs(12) },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: s(8) },
  chip: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chipActive: {
    backgroundColor: '#FFC107',
    borderColor: '#FFC107',
  },
  chipText: { fontSize: s(13), color: AppColors.medGray },
  chipTextActive: { color: AppColors.white, fontWeight: '700' },
  sliderContainer: {
    height: vs(40),
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: s(8),
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
  sliderActive: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#FFC107',
    borderRadius: 1,
  },
  thumb: {
    position: 'absolute',
    width: s(16),
    height: s(16),
    borderRadius: s(8),
    backgroundColor: AppColors.white,
    borderWidth: 4,
    borderColor: '#FFC107',
    top: '50%',
    marginTop: -8,
    marginLeft: -8,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: s(4),
    marginTop: vs(4),
  },
  priceLabel: { fontSize: s(13), color: AppColors.medGray },
  priceLabelActive: { color: '#374151', fontWeight: '600' },
  footer: { marginTop: vs(8) },
})
