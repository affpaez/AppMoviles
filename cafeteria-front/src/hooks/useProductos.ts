import { useState, useEffect, useCallback, useMemo } from 'react'
import { Producto, Categoria } from '../types/types'
import {
  obtenerProductosService,
  obtenerProductosDelDiaService,
  obtenerCategoriasService,
} from '../services/productos.service'

const MAX_POPULARES = 5
const MAX_PRODUCTOS_DEL_DIA = 5

export function useProductos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [productosDelDia, setProductosDelDia] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [cargandoMas, setCargandoMas] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const [prodsRes, delDia, cats] = await Promise.all([
          obtenerProductosService(1, 20),
          obtenerProductosDelDiaService(),
          obtenerCategoriasService(),
        ])
        setProductos(prodsRes.data || [])
        setTotalPages(prodsRes.totalPages || 1)
        setPage(1)
        setProductosDelDia(Array.isArray(delDia) ? delDia.slice(0, MAX_PRODUCTOS_DEL_DIA) : [])
        setCategorias(cats)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const cargarMas = useCallback(async () => {
    if (cargandoMas || page >= totalPages) return
    setCargandoMas(true)
    try {
      const nextPage = page + 1
      const res = await obtenerProductosService(nextPage, 20)
      setProductos((prev) => [...prev, ...(res.data || [])])
      setPage(nextPage)
      setTotalPages(res.totalPages || 1)
    } catch (error) {
      console.log(error)
    } finally {
      setCargandoMas(false)
    }
  }, [page, totalPages, cargandoMas])

  const populares = useMemo(
    () => productos.filter((p) => p.esPopular).slice(0, MAX_POPULARES),
    [productos]
  )

  const productosFiltrados = useMemo(
    () => productos,
    [productos]
  )

  return {
    productos, setProductos,
    productosDelDia,
    categorias,
    populares,
    productosFiltrados,
    totalPages,
    cargandoMas,
    page,
    cargarMas,
  }
}
