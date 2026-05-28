import { StyleSheet, View } from 'react-native'
import React from 'react'
import AppSaveView from '../../components/views/AppSaveView'
import AppText from '../../components/text/AppText'
import AppButton from '../../components/buttons/AppButton'
import { AppColors } from '../../styles/colors'
import { useNavigation } from '@react-navigation/native'
import { s, vs } from 'react-native-size-matters'
import { sharedPaddingHorizontal } from '../../styles/sharedStyles'

const AuthInitialScreen = () => {
  const navigation = useNavigation<any>()

  return (
    <AppSaveView style={styles.container}>
      <View style={styles.content}>
        <AppText variant="bold" style={styles.titulo}>
          Empecemos a ordenar! {'\u{1F601}'}
        </AppText>
        <AppText style={styles.subtitulo}>
          Regístrate o inicia sesión para disfrutar de una experiencia digital completa de nuestra cafetería.
        </AppText>

        <View style={styles.buttonsContainer}>
          <AppButton
            title="Iniciar sesión"
            onPress={() => navigation.navigate('SignInScreen')}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>

          <AppButton
            title="Registrarse ahora"
            onPress={() => navigation.navigate('SignUpScreen')}
          />
        </View>

      </View>
    </AppSaveView>
  )
}

export default AuthInitialScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: sharedPaddingHorizontal,
    alignItems: 'center',
  },
  titulo: {
    fontSize: s(26),
    textAlign: 'center',
    marginBottom: vs(12),
    color: '#33334E',
  },
  subtitulo: {
    fontSize: s(15),
    textAlign: 'center',
    color: '#7C7C94',
    lineHeight: vs(22),
    paddingHorizontal: s(16),
    marginBottom: vs(32),
  },
  buttonsContainer: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: vs(20),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginHorizontal: s(12),
  },
  skipButton: {
    marginTop: vs(24),
  },
})
