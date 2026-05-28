import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { useCartStore } from '../../store/cartStore'

const QRConfirmationScreen = () => {
  const navigation = useNavigation<any>()
  const { limpiarCarrito } = useCartStore()

  const handleSalir = () => {
    limpiarCarrito()
    navigation.navigate('MainAppBottomTabs')
  }

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="menu-outline" size={s(24)} color="#2D3748" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <AppText variant="bold" style={styles.title}>Todo listo!</AppText>

        <View style={styles.qrContainer}>
          <View style={styles.qrFrame}>
            <View style={[styles.qrCorner, styles.cornerTL]} />
            <View style={[styles.qrCorner, styles.cornerTR]} />
            <View style={[styles.qrCorner, styles.cornerBL]} />
            <View style={[styles.qrCorner, styles.cornerBR]} />
            <View style={styles.scanLine} />
            <View style={styles.qrPlaceholder}>
              <Ionicons name="qr-code-outline" size={s(100)} color="#2D3748" />
            </View>
          </View>
        </View>

        <AppText style={styles.instruction}>
          Por favor escanea este código QR para recibir tu pedido.
        </AppText>
      </View>

      <View style={styles.footer}>
        <AppButton title="Salir" onPress={handleSalir} />
      </View>
    </AppSaveView>
  )
}

export default QRConfirmationScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal, backgroundColor: '#FAFAFA' },
  header: { alignItems: 'flex-end', marginTop: vs(12), marginBottom: vs(40) },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: s(24), color: '#2D3748', marginBottom: vs(48) },
  qrContainer: { marginBottom: vs(40) },
  qrFrame: {
    width: s(220),
    height: s(220),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCorner: {
    position: 'absolute',
    width: s(24),
    height: s(24),
    borderColor: '#FFB84D',
    borderWidth: 3,
  },
  cornerTL: { top: -6, left: -6, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: s(8) },
  cornerTR: { top: -6, right: -6, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: s(8) },
  cornerBL: { bottom: -6, left: -6, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: s(8) },
  cornerBR: { bottom: -6, right: -6, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: s(8) },
  scanLine: {
    position: 'absolute',
    top: '35%',
    left: '-5%',
    width: '110%',
    height: 3,
    backgroundColor: '#FFB84D',
    shadowColor: '#FFB84D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 10,
  },
  qrPlaceholder: {
    width: s(180),
    height: s(180),
    backgroundColor: AppColors.white,
    borderRadius: s(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    fontSize: s(14),
    color: '#8E99AF',
    textAlign: 'center',
    maxWidth: s(260),
    lineHeight: vs(22),
  },
  footer: { paddingVertical: vs(24) },
})
