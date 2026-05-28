import { Platform } from 'react-native'

export const IS_Android = Platform.OS === 'android'
export const IS_IOS = Platform.OS === 'ios'
export const IVA = 0.08
export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.68:3000'