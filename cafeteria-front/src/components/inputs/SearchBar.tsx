import { StyleSheet, View, TextInput } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'

interface Props {
  onSearch: (text: string) => void
}

const SearchBar = ({ onSearch }: Props) => {
  const [text, setText] = useState('')
  const onSearchRef = useRef(onSearch)
  onSearchRef.current = onSearch
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => onSearchRef.current(text), 300)
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current) }
  }, [text])

  return (
    <View style={styles.busquedaContainer}>
      <Ionicons name="search-outline" size={s(18)} color={AppColors.medGray} />
      <TextInput
        placeholder="Search"
        value={text}
        onChangeText={setText}
        style={styles.inputBusqueda}
        placeholderTextColor={AppColors.medGray}
      />
    </View>
  )
}

export default React.memo(SearchBar)

const styles = StyleSheet.create({
  busquedaContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: AppColors.white,
    borderRadius: s(16), paddingHorizontal: s(16), height: vs(48), marginBottom: vs(16),
    borderWidth: 1, borderColor: '#F0F0F0',
  },
  inputBusqueda: { flex: 1, marginLeft: s(8), fontSize: s(14), color: AppColors.black },
})
