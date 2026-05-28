import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'

const AddNewCardScreen = () => {
  const navigation = useNavigation<any>()
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.overlayBg} onPress={() => navigation.goBack()} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <AppText variant="bold" style={styles.title}>Agregar tarjeta</AppText>

          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor={AppColors.medGray}
              />
              <View style={styles.cardIcons}>
                <View style={[styles.cardDot, { backgroundColor: '#EB001B' }]} />
                <View style={[styles.cardDot, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
              </View>
            </View>
            <TextInput
              placeholder="Nombre del titular"
              value={cardName}
              onChangeText={setCardName}
              style={styles.input}
              placeholderTextColor={AppColors.medGray}
            />
            <View style={styles.row}>
              <TextInput
                placeholder="MM/AA"
                value={expiry}
                onChangeText={setExpiry}
                style={[styles.input, styles.halfInput]}
                placeholderTextColor={AppColors.medGray}
              />
              <TextInput
                placeholder="CVV"
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
                placeholderTextColor={AppColors.medGray}
              />
            </View>
          </View>

          <AppButton title="Agregar tarjeta" onPress={() => navigation.goBack()} />
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default AddNewCardScreen

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  overlayBg: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: AppColors.white,
    borderTopLeftRadius: s(32),
    borderTopRightRadius: s(32),
    padding: s(24),
    paddingBottom: vs(44),
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
    color: '#1F2937',
    marginBottom: vs(20),
  },
  form: {
    gap: vs(14),
    marginBottom: vs(20),
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: vs(52),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: s(16),
    paddingHorizontal: s(16),
    fontSize: s(14),
    color: '#374151',
    backgroundColor: AppColors.white,
  },
  halfInput: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: s(12),
  },
  cardIcons: {
    position: 'absolute',
    right: s(14),
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardDot: {
    width: s(22),
    height: s(22),
    borderRadius: s(11),
  },
})
