export const formatPrice = (price: number) => `$${price.toFixed(2)}`

export const formatCardNumber = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 16)
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export const formatExpiry = (text: string) => {
  const digits = text.replace(/\D/g, '').slice(0, 4)
  return digits.length >= 3 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits
}

export const esNumero = (val: string) => /^\d*$/.test(val)
