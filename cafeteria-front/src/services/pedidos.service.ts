import api from './api'

export const crearPedidoService = async (data: any) => {
  const response = await api.post('/pedidos', data)
  return response.data
}

export const obtenerPedidoService = async (id: string) => {
  const response = await api.get(`/pedidos/${id}`)
  return response.data
}

export const obtenerPedidosPorUsuarioService = async (usuarioId: string) => {
  const response = await api.get(`/pedidos/usuario/${usuarioId}`)
  return response.data
}
