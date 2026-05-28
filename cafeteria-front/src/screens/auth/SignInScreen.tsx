import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import AppTextInput from '../../components/inputs/AppTextInput'
import { AppColors } from '../../styles/colors'
import { useNavigation } from '@react-navigation/native'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { loginService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import { showMessage } from 'react-native-flash-message'

const SignInScreen = () => {
  const navigation = useNavigation<any>()
  const { setAuth } = useAuthStore()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      showMessage({
        message: 'Por favor llena todos los campos',
        type: 'warning',
      })
      return
    }

    try {
      setCargando(true)
      const respuesta = await loginService({ correo, contrasena })
      setAuth(respuesta.usuario, respuesta.token)
      navigation.getParent()?.navigate('MainAppBottomTabs')
    } catch (error: any) {
      showMessage({
        message: error?.response?.data?.message || 'Credenciales incorrectas',
        type: 'danger',
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <AppSaveView style={styles.container}>
      <AppText variant="bold" style={styles.titulo}>
        Hola de nuevo! ✌️
      </AppText>
      <AppText style={styles.subtitulo}>
        Inicia sesión para vivir la experiencia completa.
      </AppText>

      <AppTextInput
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <AppTextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

      <AppButton
        title="Siguiente"
        onPress={handleLogin}
        disabled={cargando}
      />

      <AppButton
        title="¿Eres nuevo? Regístrate"
        backgroundColor="transparent"
        textColor={AppColors.primary}
        onPress={() => navigation.navigate('SignUpScreen')}
        style={styles.botonRegistro}
      />
    </AppSaveView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: sharedPaddingHorizontal,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: s(24),
    textAlign: 'center',
    marginBottom: vs(8),
  },
  subtitulo: {
    fontSize: s(14),
    textAlign: 'center',
    color: AppColors.medGray,
    lineHeight: vs(22),
    marginBottom: vs(24),
  },
  botonRegistro: {
    marginTop: vs(12),
  },
})