import api from './api'

export interface ValidarDescuentoResponse {
  valido: boolean
  porcentaje?: number
  descuentoId?: string
  mensaje: string
}

export const validarDescuentoService = async (codigo: string) => {
  const response = await api.post('/descuentos/validar', { codigo })
  return response.data as ValidarDescuentoResponse
}
