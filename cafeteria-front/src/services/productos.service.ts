import axios from 'axios'
import { API_URL } from '../constants/constants'

const api = axios.create({
  baseURL: API_URL,
})

export const obtenerProductosService = async () => {
  const response = await api.get('/productos')
  return response.data
}

export const obtenerProductoDelDiaService = async () => {
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

export const filtrarPorCategoriaService = async (categoriaId: string) => {
  const response = await api.get(`/productos/categoria/${categoriaId}`)
  return response.data
}