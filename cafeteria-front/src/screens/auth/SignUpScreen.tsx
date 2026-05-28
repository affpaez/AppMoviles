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
  const [cargando, setCargando] = useState(false)

  const handleRegistro = async () => {
    if (!nombre || !correo || !contrasena) {
      showMessage({
        message: 'Por favor llena todos los campos obligatorios',
        type: 'warning',
      })
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
        ¡Bienvenido! ✌️
      </AppText>
      <AppText style={styles.subtitulo}>
        ¡Parece que eres nuevo por aquí! Crea una cuenta para disfrutar de una
        experiencia completa.
      </AppText>

      <AppTextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <AppTextInput
        placeholder="Correo electrónico"
        value={correo}
        onChangeText={setCorreo}
        keyboardType="email-address"
      />
      <AppTextInput
        placeholder="Celular"
        value={celular}
        onChangeText={setCelular}
        keyboardType="numeric"
      />
      <AppTextInput
        placeholder="Contraseña"
        value={contrasena}
        onChangeText={setContrasena}
        secureTextEntry
      />

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
        style={styles.botonVolver}
      />
    </AppSaveView>
  )
}

export default SignUpScreen

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
  botonVolver: {
    marginTop: vs(12),
  },
})