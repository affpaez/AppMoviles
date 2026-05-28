import { StyleSheet, View, TouchableOpacity } from 'react-native'
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
import { loginService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import { showMessage } from 'react-native-flash-message'

const SignInScreen = () => {
  const navigation = useNavigation<any>()
  const { setAuth } = useAuthStore()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [cargando, setCargando] = useState(false)

  const handleLogin = async () => {
    if (!correo || !contrasena) {
      showMessage({ message: 'Por favor llena todos los campos', type: 'warning' })
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
      <View style={styles.content}>
        <AppText variant="bold" style={styles.titulo}>
          Hola de nuevo! {'\u270C\uFE0F'}
        </AppText>
        <AppText style={styles.subtitulo}>
          Inicia sesión para vivir la experiencia completa.
        </AppText>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <AppTextInput
              placeholder="Correo electrónico"
              value={correo}
              onChangeText={setCorreo}
              keyboardType="email-address"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.passwordWrapper}>
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
        </View>
      </View>

      <View style={styles.footer}>
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
          style={styles.registerButton}
        />
      </View>
    </AppSaveView>
  )
}

export default SignInScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    paddingHorizontal: sharedPaddingHorizontal,
    paddingTop: vs(60),
  },
  titulo: {
    fontSize: s(24),
    textAlign: 'center',
    marginBottom: vs(8),
    color: '#313351',
  },
  subtitulo: {
    fontSize: s(15),
    textAlign: 'center',
    color: '#8C8EAC',
    lineHeight: vs(22),
    marginBottom: vs(32),
    paddingHorizontal: s(16),
  },
  form: {
    gap: vs(16),
  },
  inputContainer: {},
  input: {
    borderRadius: s(16),
    height: vs(56),
    paddingHorizontal: s(20),
  },
  passwordWrapper: {
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
    paddingHorizontal: sharedPaddingHorizontal,
    paddingBottom: vs(40),
  },
  registerButton: {
    marginTop: vs(12),
  },
})
