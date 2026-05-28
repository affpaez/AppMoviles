import { StyleSheet, View, TouchableOpacity } from 'react-native'
import React from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'
import { useAuthStore } from '../../store/authStore'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
  const navigation = useNavigation<any>()
  const { usuario, cerrarSesion } = useAuthStore()

  const handleCerrarSesion = () => {
    cerrarSesion()
    navigation.navigate('AuthStack')
  }

  return (
    <AppSaveView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <AppText variant="bold" style={styles.avatarTexto}>
            {usuario?.nombre?.charAt(0).toUpperCase()}
          </AppText>
        </View>
        <AppText variant="bold" style={styles.nombre}>
          {usuario?.nombre}
        </AppText>
        <AppText style={styles.correo}>{usuario?.correo}</AppText>
        <AppText style={styles.rol}>{usuario?.rol}</AppText>
      </View>

      {/* Opciones */}
      <View style={styles.opciones}>

        <TouchableOpacity style={styles.opcionItem}>
          <Ionicons name="receipt-outline" size={s(22)} color={AppColors.primary} />
          <AppText style={styles.opcionTexto}>Mis pedidos</AppText>
          <Ionicons name="chevron-forward" size={s(18)} color={AppColors.medGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcionItem}>
          <Ionicons name="card-outline" size={s(22)} color={AppColors.primary} />
          <AppText style={styles.opcionTexto}>Mis tarjetas</AppText>
          <Ionicons name="chevron-forward" size={s(18)} color={AppColors.medGray} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.opcionItem}>
          <Ionicons name="person-outline" size={s(22)} color={AppColors.primary} />
          <AppText style={styles.opcionTexto}>Editar perfil</AppText>
          <Ionicons name="chevron-forward" size={s(18)} color={AppColors.medGray} />
        </TouchableOpacity>

      </View>

      {/* Cerrar sesión */}
      <AppButton
        title="Cerrar sesión"
        onPress={handleCerrarSesion}
        backgroundColor={AppColors.redColor}
        style={styles.botonCerrarSesion}
      />

    </AppSaveView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: sharedPaddingHorizontal,
  },
  header: {
    alignItems: 'center',
    paddingVertical: vs(32),
  },
  avatar: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    backgroundColor: AppColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  avatarTexto: {
    color: AppColors.white,
    fontSize: s(32),
  },
  nombre: {
    fontSize: s(20),
    marginBottom: vs(4),
  },
  correo: {
    color: AppColors.medGray,
    fontSize: s(14),
    marginBottom: vs(4),
  },
  rol: {
    color: AppColors.primary,
    fontSize: s(12),
  },
  opciones: {
    backgroundColor: AppColors.white,
    borderRadius: s(12),
    borderWidth: 1,
    borderColor: AppColors.borderColor,
    marginBottom: vs(24),
  },
  opcionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: AppColors.borderColor,
    gap: s(12),
  },
  opcionTexto: {
    flex: 1,
    fontSize: s(14),
  },
  botonCerrarSesion: {
    marginTop: 'auto',
    marginBottom: vs(16),
  },
})