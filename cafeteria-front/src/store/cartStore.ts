import { create } from 'zustand'
import { ItemCarrito } from '../types/types'

interface CartState {
  items: ItemCarrito[]
  agregarItem: (item: ItemCarrito) => void
  eliminarItem: (productoId: string) => void
  actualizarCantidad: (productoId: string, cantidad: number) => void
  limpiarCarrito: () => void
  total: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  agregarItem: (nuevoItem) => {
    const items = get().items
    const existe = items.find((i) => i.producto.id === nuevoItem.producto.id)

    if (existe) {
      set({
        items: items.map((i) =>
          i.producto.id === nuevoItem.producto.id
            ? { ...i, cantidad: i.cantidad + nuevoItem.cantidad }
            : i
        ),
      })
    } else {
      set({ items: [...items, nuevoItem] })
    }
  },

  eliminarItem: (productoId) => {
    set({ items: get().items.filter((i) => i.producto.id !== productoId) })
  },

  actualizarCantidad: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().eliminarItem(productoId)
      return
    }
    set({
      items: get().items.map((i) =>
        i.producto.id === productoId ? { ...i, cantidad } : i
      ),
    })
  },

  limpiarCarrito: () => set({ items: [] }),

  total: () => {
    return get().items.reduce((acc, item) => {
      const extrasTotal = item.extras.reduce((a, e) => a + e.precio, 0)
      return acc + (item.precio + extrasTotal) * item.cantidad
    }, 0)
  },
}))
