import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useNavigation } from '@react-navigation/native'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/api'
import { showMessage } from 'react-native-flash-message'

const EditProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { usuario, setAuth } = useAuthStore()
  const [nombre, setNombre] = useState(usuario?.nombre || '')
  const [contrasena, setContrasena] = useState('')
  const [repetirContrasena, setRepetirContrasena] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showRep, setShowRep] = useState(false)
  const [cargando, setCargando] = useState(false)

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/

  const handleGuardar = async () => {
    if (contrasena && !passwordRegex.test(contrasena)) {
      showMessage({
        message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
        type: 'warning',
      })
      return
    }
    if (contrasena !== repetirContrasena) {
      showMessage({ message: 'Las contraseñas no coinciden', type: 'warning' })
      return
    }
    try {
      setCargando(true)
      const body: any = {}
      if (nombre !== usuario?.nombre) body.nombre = nombre
      if (contrasena) body.contrasena = contrasena
      const res = await api.patch('/usuarios/me', body)
      setAuth(res.data, useAuthStore.getState().token!)
      showMessage({ message: 'Perfil actualizado', type: 'success' })
      navigation.goBack()
    } catch (error: any) {
      showMessage({ message: error?.response?.data?.message || 'Error al actualizar', type: 'danger' })
    } finally {
      setCargando(false)
    }
  }

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={s(22)} color="#6B7280" />
        </TouchableOpacity>
        <AppText variant="bold" style={styles.headerTitle}>Editar perfil</AppText>
      </View>

      <View style={styles.form}>
        <TextInput
          placeholder="Nombre"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          placeholderTextColor={AppColors.medGray}
        />

        <View style={styles.passWrapper}>
          <TextInput
            placeholder="Nueva contraseña"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!showPass}
            style={styles.input}
            placeholderTextColor={AppColors.medGray}
          />
          <TouchableOpacity style={styles.eye} onPress={() => setShowPass(!showPass)}>
            <Ionicons name={showPass ? 'eye-outline' : 'eye-off-outline'} size={s(20)} color={AppColors.medGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.passWrapper}>
          <TextInput
            placeholder="Repetir contraseña"
            value={repetirContrasena}
            onChangeText={setRepetirContrasena}
            secureTextEntry={!showRep}
            style={styles.input}
            placeholderTextColor={AppColors.medGray}
          />
          <TouchableOpacity style={styles.eye} onPress={() => setShowRep(!showRep)}>
            <Ionicons name={showRep ? 'eye-outline' : 'eye-off-outline'} size={s(20)} color={AppColors.medGray} />
          </TouchableOpacity>
        </View>
      </View>

      <AppButton title="Guardar cambios" onPress={handleGuardar} disabled={cargando} />
    </AppSaveView>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: sharedPaddingHorizontal },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(24), gap: s(12) },
  backButton: { width: s(44), height: s(44), borderRadius: s(14), backgroundColor: AppColors.white, borderWidth: 1, borderColor: '#F0F0F0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: s(20), color: '#1F2937' },
  form: { gap: vs(14), marginBottom: vs(24) },
  input: { height: vs(52), borderWidth: 1, borderColor: '#E5E7EB', borderRadius: s(16), paddingHorizontal: s(16), fontSize: s(14), color: '#374151', backgroundColor: AppColors.white },
  passWrapper: { position: 'relative' },
  eye: { position: 'absolute', right: s(16), top: 0, bottom: 0, justifyContent: 'center' },
})
