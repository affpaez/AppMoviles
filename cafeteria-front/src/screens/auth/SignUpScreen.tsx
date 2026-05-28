import { StyleSheet, View, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import AppTextInput from '../../components/inputs/AppTextInput'
import { AppColors } from '../../styles/colors'
import { useNavigation } from '@react-navigation/native'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { registroService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import { showMessage } from 'react-native-flash-message'

const SignUpScreen = () => {
  const navigation = useNavigation<any>()
  const { setAuth } = useAuthStore()

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [celular, setCelular] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      showMessage({ message: 'Por favor llena todos los campos obligatorios', type: 'warning' })
      return
    }
    try {
      setCargando(true)
      const respuesta = await registroService({ nombre, correo, celular, contrasena })
      setAuth(respuesta.usuario, respuesta.token)
      navigation.getParent()?.navigate('MainAppBottomTabs')
    } catch (error: any) {
      showMessage({
        message: error?.response?.data?.message || 'Error al registrarse',
        type: 'danger',
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <AppSaveView style={styles.container}>
      <AppText variant="bold" style={styles.titulo}>
        ¡Bienvenido! {'\u270C\uFE0F'}
      </AppText>
      <AppText style={styles.subtitulo}>
        ¡Parece que eres nuevo por aquí! Crea una cuenta para disfrutar de una experiencia completa.
      </AppText>

      <View style={styles.form}>
        <AppTextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
        />
        <AppTextInput
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          style={styles.input}
        />
        <View style={styles.phoneContainer}>
          <TouchableOpacity style={styles.countryPicker}>
            <AppText style={styles.countryCode}>+52</AppText>
            <Ionicons name="chevron-down" size={s(14)} color={AppColors.medGray} />
          </TouchableOpacity>
          <TextInput
            placeholder="Celular"
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
            style={styles.phoneInput}
            placeholderTextColor={AppColors.medGray}
          />
        </View>
        <View style={styles.passwordContainer}>
          <AppTextInput
            placeholder="Contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={s(22)}
              color={AppColors.medGray}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <AppButton
          title="Siguiente"
          onPress={handleRegistro}
          disabled={cargando}
        />
        <AppButton
          title="Volver al inicio de sesión"
          backgroundColor="transparent"
          textColor={AppColors.primary}
          onPress={() => navigation.navigate('SignInScreen')}
          style={styles.backButton}
        />
      </View>
    </AppSaveView>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sharedPaddingHorizontal,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: s(24),
    textAlign: 'center',
    marginBottom: vs(8),
    color: '#374151',
  },
  subtitulo: {
    fontSize: s(14),
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: vs(22),
    marginBottom: vs(24),
    paddingHorizontal: s(16),
  },
  form: {
    gap: vs(14),
  },
  input: {
    borderRadius: s(16),
    height: vs(54),
    paddingHorizontal: s(20),
    backgroundColor: '#FAFAFA',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: vs(54),
    borderRadius: s(16),
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    paddingLeft: s(12),
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingRight: s(12),
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
  },
  countryCode: {
    fontSize: s(14),
    color: '#374151',
  },
  phoneInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: s(12),
    fontSize: s(14),
    color: '#374151',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: s(16),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
  footer: {
    marginTop: vs(32),
  },
  backButton: {
    marginTop: vs(12),
  },
})
