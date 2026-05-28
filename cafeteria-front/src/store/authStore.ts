import { create } from 'zustand'
import { Usuario } from '../types/types'
import { useCartStore } from './cartStore'

interface AuthState {
  usuario: Usuario | null
  token: string | null
  setAuth: (usuario: Usuario, token: string) => void
  cerrarSesion: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  usuario: null,
  token: null,
  setAuth: (usuario, token) => {
    useCartStore.getState().limpiarCarrito()
    set({ usuario, token })
  },
  cerrarSesion: () => {
    useCartStore.getState().limpiarCarrito()
    set({ usuario: null, token: null })
  },
}))
