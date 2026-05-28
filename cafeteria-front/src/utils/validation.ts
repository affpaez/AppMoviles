export const isValidExpiry = (text: string) => {
  const match = text.match(/^(\d{2})\/(\d{2})$/)
  if (!match) return false
  const month = parseInt(match[1])
  const year = parseInt(match[2]) + 2000
  return month >= 1 && month <= 12 && new Date(year, month, 0) > new Date()
}

export const isValidCardNumber = (number: string) =>
  number.replace(/\s/g, '').length === 16

export const isValidCvv = (cvv: string) => /^\d{3}$/.test(cvv)
