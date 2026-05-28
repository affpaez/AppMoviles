import api from './api'

export interface ProcesarPagoData {
  pedidoId: string
  metodoPago: 'EFECTIVO' | 'TARJETA'
  tarjetaId?: string
}

export const procesarPagoService = async (data: ProcesarPagoData) => {
  const response = await api.post('/pagos', data)
  return response.data
}

export const obtenerPagoService = async (id: string) => {
  const response = await api.get(`/pagos/${id}`)
  return response.data
}

export const obtenerPagoPorPedidoService = async (pedidoId: string) => {
  const response = await api.get(`/pagos/pedido/${pedidoId}`)
  return response.data
}
