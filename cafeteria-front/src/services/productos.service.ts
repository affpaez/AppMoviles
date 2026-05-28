import api from './api'

export const obtenerProductosService = async (page = 1, limit = 20) => {
  const response = await api.get(`/productos?page=${page}&limit=${limit}`)
  return response.data
}

export const obtenerProductosDelDiaService = async () => {
  const response = await api.get('/productos/producto-del-dia')
  return response.data
}

export const obtenerPopularesService = async () => {
  const response = await api.get('/productos/populares')
  return response.data
}

export const obtenerCategoriasService = async () => {
  const response = await api.get('/categorias')
  return response.data
}

export const buscarProductosService = async (nombre: string) => {
  const response = await api.get(`/productos/buscar?nombre=${nombre}`)
  return response.data
}

export const filtrarPorCategoriaService = async (categoriaId: string, page = 1, limit = 20) => {
  const response = await api.get(`/productos/categoria/${categoriaId}?page=${page}&limit=${limit}`)
  return response.data
}
