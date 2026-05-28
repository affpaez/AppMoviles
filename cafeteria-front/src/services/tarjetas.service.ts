import api from './api'

export interface CrearTarjetaData {
  numero: string
  nombreTitular: string
  fechaExp: string
}

export const crearTarjetaService = async (data: CrearTarjetaData) => {
  const response = await api.post('/tarjetas', {
    numero: data.numero,
    nombreTitular: data.nombreTitular,
    fechaExp: data.fechaExp,
  })
  return response.data
}

export const listarTarjetasService = async () => {
  const response = await api.get('/tarjetas')
  return response.data
}

export const eliminarTarjetaService = async (id: string) => {
  const response = await api.delete(`/tarjetas/${id}`)
  return response.data
}

export const marcarTarjetaDefectoService = async (id: string) => {
  const response = await api.patch(`/tarjetas/${id}/defecto`)
  return response.data
}
