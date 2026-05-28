import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Modal, Animated, PanResponder, KeyboardAvoidingView, Platform, Easing } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { IVA } from '../../constants/constants'
import { validarDescuentoService } from '../../services/descuentos.service'
import { crearTarjetaService, listarTarjetasService } from '../../services/tarjetas.service'
import { crearPedidoService } from '../../services/pedidos.service'
import { procesarPagoService } from '../../services/pagos.service'
import { showMessage } from 'react-native-flash-message'
import { Tarjeta } from '../../types/types'

const CheckoutNoCardScreen = () => {
  const navigation = useNavigation<any>()
  const { items, total, limpiarCarrito } = useCartStore()
  const { usuario } = useAuthStore()
  const subtotal = total()

  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([])
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string | null>(null)
  const [codigo, setCodigo] = useState('')
  const [descuentoId, setDescuentoId] = useState<string | null>(null)
  const [descuentoPorcentaje, setDescuentoPorcentaje] = useState(0)
  const [descuentoMsg, setDescuentoMsg] = useState('')
  const [propina, setPropina] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [showAddCard, setShowAddCard] = useState(false)

  const translateY = useRef(new Animated.Value(400)).current
  const pulseAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (paymentStatus === 'processing') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.3, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      ).start()
    } else {
      pulseAnim.stopAnimation()
      pulseAnim.setValue(1)
    }
  }, [paymentStatus])

  useEffect(() => {
    listarTarjetasService().then((t) => {
      setTarjetas(t)
      const def = t.find((card: Tarjeta) => card.pagoPorDefecto)
      if (def) setTarjetaSeleccionada(def.id)
      else if (t.length > 0) setTarjetaSeleccionada(t[0].id)
    }).catch(() => {})
  }, [])

  const descuentoAplicado = subtotal * (descuentoPorcentaje / 100)
  const subtotalConDescuento = subtotal - descuentoAplicado
  const iva = subtotalConDescuento * IVA
  const propinaNum = Number(propina) || 0
  const totalFinal = subtotalConDescuento + iva + propinaNum

  const openCardSheet = () => {
    setShowAddCard(true)
    Animated.spring(translateY, { toValue: 0, damping: 20, stiffness: 200, useNativeDriver: true }).start()
  }

  const closeCardSheet = () => {
    Animated.spring(translateY, { toValue: 400, damping: 20, stiffness: 200, useNativeDriver: true }).start()
    setTimeout(() => setShowAddCard(false), 200)
  }

  const cardPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 5,
      onPanResponderRelease: (_, gs) => { if (gs.dy > 120) closeCardSheet() },
    })
  ).current

  const handleValidarDescuento = async () => {
    if (!codigo) return
    try {
      const res = await validarDescuentoService(codigo)
      if (res.valido) {
        setDescuentoId(res.descuentoId!)
        setDescuentoPorcentaje(res.porcentaje || 0)
        setDescuentoMsg(`Descuento del ${res.porcentaje}% aplicado`)
      } else {
        setDescuentoId(null)
        setDescuentoPorcentaje(0)
        setDescuentoMsg(res.mensaje)
      }
    } catch {
      setDescuentoMsg('Error al validar código')
    }
  }

  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [cargando, setCargando] = useState(false)

  const formatCardNumber = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4)
    return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
  }

  const isValidExpiry = (text: string) => {
    const match = text.match(/^(\d{2})\/(\d{2})$/)
    if (!match) return false
    const month = parseInt(match[1])
    const year = parseInt(match[2]) + 2000
    return month >= 1 && month <= 12 && new Date(year, month, 0) > new Date()
  }

  const handleAgregarTarjeta = async () => {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    if (cleanNumber.length !== 16) { showMessage({ message: 'El número debe tener 16 dígitos', type: 'warning' }); return }
    if (!cardName) { showMessage({ message: 'Ingresa el nombre del titular', type: 'warning' }); return }
    if (!isValidExpiry(expiry)) { showMessage({ message: 'Fecha inválida', type: 'warning' }); return }
    if (cvv.length !== 3) { showMessage({ message: 'El CVV debe tener 3 dígitos', type: 'warning' }); return }
    try {
      setCargando(true)
      const nueva = await crearTarjetaService({ numero: cleanNumber, nombreTitular: cardName, fechaExp: expiry })
      setTarjetas((prev) => [...prev, nueva])
      setTarjetaSeleccionada(nueva.id)
      closeCardSheet()
      setCardNumber(''); setCardName(''); setExpiry(''); setCvv('')
    } catch (error: any) {
      showMessage({ message: error?.response?.data?.message || 'Error al agregar tarjeta', type: 'danger' })
    } finally { setCargando(false) }
  }

  const handlePagar = async () => {
    if (!usuario?.id) return
    if (!tarjetaSeleccionada) { showMessage({ message: 'Selecciona una tarjeta', type: 'warning' }); return }
    try {
      setPaymentStatus('processing')
      const pedido = await crearPedidoService({
        usuarioId: usuario.id,
        items: items.map((item) => ({
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precio: item.precio,
          comentario: item.comentario,
          extras: item.extras.map((e) => ({ extraId: e.id, precio: e.precio })),
        })),
        propina: propinaNum,
        descuentoId: descuentoId || undefined,
      })
      await procesarPagoService({ pedidoId: pedido.id, metodoPago: 'TARJETA', tarjetaId: tarjetaSeleccionada })
      setPaymentStatus('success')
      limpiarCarrito()
      setTimeout(() => {
        setPaymentStatus('idle')
        navigation.navigate('OrderStatusScreen', { pedido })
      }, 1500)
    } catch (error: any) {
      setPaymentStatus('idle')
      showMessage({ message: error?.response?.data?.message || 'Error al procesar el pago', type: 'danger' })
    } finally { setEnviando(false) }
  }

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>Pago</AppText>
        <View style={styles.backButton} />
      </View>

      <ScrollView>
        <View style={styles.tarjetasSection}>
          {tarjetas.map((t) => (
            <TouchableOpacity key={t.id} style={[styles.tarjetaCard, tarjetaSeleccionada === t.id && styles.tarjetaActiva]} onPress={() => setTarjetaSeleccionada(t.id)}>
              <View style={styles.radioRow}>
                <View style={[styles.radio, tarjetaSeleccionada === t.id && styles.radioActivo]}>
                  {tarjetaSeleccionada === t.id && <View style={styles.radioInner} />}
                </View>
                <View style={styles.tarjetaInfo}>
                  <AppText variant="bold" style={styles.tarjetaMarca}>{t.marca || 'Tarjeta'}</AppText>
                  <AppText style={styles.tarjetaNumero}>**** {t.ultimosDigitos}</AppText>
                </View>
                <AppText style={styles.tarjetaExp}>{t.fechaExp}</AppText>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.agregarBtn} onPress={openCardSheet}>
            <Ionicons name="add-circle-outline" size={s(20)} color={AppColors.primary} />
            <AppText style={styles.agregarText}>Agregar nueva tarjeta</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>Subtotal</AppText>
            <AppText variant="bold" style={styles.summaryValue}>${subtotal.toFixed(2)}</AppText>
          </View>

          {descuentoId && (
            <View style={styles.summaryRow}>
              <AppText style={styles.summaryLabel}>Descuento ({descuentoPorcentaje}%)</AppText>
              <AppText variant="bold" style={[styles.summaryValue, { color: '#00733F' }]}>-${descuentoAplicado.toFixed(2)}</AppText>
            </View>
          )}

          <View style={styles.summaryRow}>
            <AppText style={styles.summaryLabel}>IVA (8%)</AppText>
            <AppText variant="bold" style={styles.summaryValue}>${iva.toFixed(2)}</AppText>
          </View>

          <View style={styles.divider} />

          <View style={styles.inputRow}>
            <Ionicons name="pricetag-outline" size={s(18)} color={AppColors.medGray} />
            <TextInput
              placeholder="Aplicar código de descuento"
              value={codigo}
              onChangeText={(t) => { setCodigo(t); setDescuentoMsg(''); setDescuentoId(null); setDescuentoPorcentaje(0) }}
              style={styles.discountInput}
              placeholderTextColor={AppColors.medGray}
            />
            {codigo ? <TouchableOpacity onPress={handleValidarDescuento}><AppText style={styles.validarBtn}>Validar</AppText></TouchableOpacity> : null}
          </View>
          {descuentoMsg ? <AppText style={[styles.descuentoMsg, descuentoId ? styles.descuentoExito : styles.descuentoError]}>{descuentoMsg}</AppText> : null}

          <View style={styles.inputRow}>
            <Ionicons name="cash-outline" size={s(18)} color={AppColors.medGray} />
            <TextInput
              placeholder="Agregar propina"
              value={propina}
              onChangeText={setPropina}
              keyboardType="numeric"
              style={styles.discountInput}
              placeholderTextColor={AppColors.medGray}
            />
          </View>

          <View style={styles.totalRow}>
            <AppText variant="bold" style={styles.totalLabel}>Total</AppText>
            <View style={styles.totalValueRow}>
              <AppText style={styles.totalSigno}>$</AppText>
              <AppText variant="bold" style={styles.totalValue}>{totalFinal.toFixed(2)}</AppText>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title={`Pagar $${totalFinal.toFixed(2)}`} onPress={handlePagar} disabled={enviando || !tarjetaSeleccionada} />
      </View>

      <Modal visible={showAddCard} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.overlayBg} activeOpacity={1} onPress={closeCardSheet} />
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Animated.View style={[styles.bottomSheet, { transform: [{ translateY }] }]} {...cardPanResponder.panHandlers}>
              <View style={styles.handle} />
              <AppText variant="bold" style={styles.sheetTitle}>Agregar tarjeta</AppText>
              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <TextInput placeholder="Número de tarjeta" value={cardNumber} onChangeText={(t) => setCardNumber(formatCardNumber(t))} keyboardType="numeric" style={styles.input} placeholderTextColor={AppColors.medGray} maxLength={19} />
                  <View style={styles.cardIcons}>
                    <View style={[styles.cardDot, { backgroundColor: '#EB001B' }]} />
                    <View style={[styles.cardDot, { backgroundColor: '#F79E1B', marginLeft: -8 }]} />
                  </View>
                </View>
                <TextInput placeholder="Nombre del titular" value={cardName} onChangeText={setCardName} style={styles.input} placeholderTextColor={AppColors.medGray} />
                <View style={styles.row}>
                  <TextInput placeholder="MM/AA" value={expiry} onChangeText={(t) => setExpiry(formatExpiry(t))} style={[styles.input, styles.halfInput]} placeholderTextColor={AppColors.medGray} maxLength={5} />
                  <TextInput placeholder="CVV" value={cvv} onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))} keyboardType="numeric" style={[styles.input, styles.halfInput]} placeholderTextColor={AppColors.medGray} maxLength={3} />
                </View>
              </View>
              <AppButton title="Agregar tarjeta" onPress={handleAgregarTarjeta} disabled={cargando} />
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <Modal visible={paymentStatus !== 'idle'} transparent animationType="fade">
        <View style={styles.paymentOverlay}>
          {paymentStatus === 'processing' ? (
            <View style={styles.paymentBox}>
              <Ionicons name="card-outline" size={s(64)} color={AppColors.white} />
              <Animated.View style={[styles.pulseDot, { opacity: pulseAnim }]} />
              <AppText style={styles.paymentText}>Procesando pago...</AppText>
            </View>
          ) : (
            <View style={styles.paymentBox}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={s(48)} color={AppColors.white} />
              </View>
              <AppText style={styles.paymentText}>Pago realizado!</AppText>
            </View>
          )}
        </View>
      </Modal>
    </AppSaveView>
  )
}

export default CheckoutNoCardScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal, backgroundColor: '#FDFDFD' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(12), marginBottom: vs(20) },
  backButton: { width: s(44), height: s(44), borderRadius: s(14), backgroundColor: AppColors.white, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  tarjetasSection: { marginBottom: vs(16) },
  tarjetaCard: { backgroundColor: AppColors.white, borderRadius: s(16), padding: s(14), marginBottom: vs(8), borderWidth: 1.5, borderColor: '#F0F0F0' },
  tarjetaActiva: { borderColor: AppColors.primary, backgroundColor: '#F0FFF4' },
  radioRow: { flexDirection: 'row', alignItems: 'center' },
  radio: { width: s(22), height: s(22), borderRadius: s(11), borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: s(12) },
  radioActivo: { borderColor: AppColors.primary },
  radioInner: { width: s(12), height: s(12), borderRadius: s(6), backgroundColor: AppColors.primary },
  tarjetaInfo: { flex: 1 },
  tarjetaMarca: { fontSize: s(14), color: '#1F2937' },
  tarjetaNumero: { fontSize: s(12), color: AppColors.medGray },
  tarjetaExp: { fontSize: s(12), color: AppColors.medGray },
  agregarBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12), gap: s(8) },
  agregarText: { fontSize: s(14), color: AppColors.primary, fontWeight: '600' },
  summary: { backgroundColor: AppColors.white, borderRadius: s(32), padding: s(20), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10) },
  summaryLabel: { fontSize: s(14), color: AppColors.medGray },
  summaryValue: { fontSize: s(16), color: '#1F2937' },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: vs(12) },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', borderRadius: s(16), paddingHorizontal: s(14), height: vs(50), marginBottom: vs(12) },
  discountInput: { flex: 1, marginLeft: s(8), fontSize: s(13), color: '#374151' },
  validarBtn: { fontSize: s(12), color: '#00733F', fontWeight: '600', marginLeft: s(8) },
  descuentoMsg: { fontSize: s(12), marginTop: vs(-6), marginBottom: vs(8), paddingLeft: s(4) },
  descuentoExito: { color: '#00733F' },
  descuentoError: { color: '#DC2626' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(8) },
  totalLabel: { fontSize: s(18), color: '#1F2937' },
  totalValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  totalSigno: { fontSize: s(12), color: '#FBBF24', fontWeight: 'bold', marginRight: s(2) },
  totalValue: { fontSize: s(22), color: '#1F2937', fontWeight: '900' },
  footer: { paddingVertical: vs(12) },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  overlayBg: { flex: 1 },
  bottomSheet: { backgroundColor: AppColors.white, borderTopLeftRadius: s(32), borderTopRightRadius: s(32), padding: s(24), paddingBottom: vs(44) },
  handle: { width: s(40), height: s(5), backgroundColor: '#D1D5DB', borderRadius: s(3), alignSelf: 'center', marginBottom: vs(20) },
  sheetTitle: { fontSize: s(18), textAlign: 'center', color: '#1F2937', marginBottom: vs(20) },
  form: { gap: vs(14), marginBottom: vs(20) },
  inputWrapper: { position: 'relative' },
  input: { height: vs(52), borderWidth: 1, borderColor: '#E5E7EB', borderRadius: s(16), paddingHorizontal: s(16), fontSize: s(14), color: '#374151', backgroundColor: AppColors.white },
  halfInput: { flex: 1 },
  row: { flexDirection: 'row', gap: s(12) },
  cardIcons: { position: 'absolute', right: s(14), top: 0, bottom: 0, flexDirection: 'row', alignItems: 'center' },
  cardDot: { width: s(22), height: s(22), borderRadius: s(11) },
  paymentOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  paymentBox: { alignItems: 'center' },
  pulseDot: { width: s(12), height: s(12), borderRadius: s(6), backgroundColor: AppColors.white, marginTop: vs(20), marginBottom: vs(8) },
  checkCircle: { width: s(80), height: s(80), borderRadius: s(40), backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center', marginBottom: vs(16) },
  paymentText: { fontSize: s(18), color: AppColors.white, fontWeight: '600', marginTop: vs(8) },
})
