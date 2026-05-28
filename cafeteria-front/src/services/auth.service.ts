import api from './api'

export interface RegistroData {
  nombre: string
  correo: string
  celular?: string
  contrasena: string
}

export interface LoginData {
  correo: string
  contrasena: string
}

export const registroService = async (data: RegistroData) => {
  const response = await api.post('/auth/registro', data)
  return response.data
}

export const loginService = async (data: LoginData) => {
  const response = await api.post('/auth/login', data)
  return response.data
}

export const obtenerPerfilService = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
