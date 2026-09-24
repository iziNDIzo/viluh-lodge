import { lodge } from './config'

export const today = new Date()
today.setHours(0, 0, 0, 0)

export const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export const rooms = lodge.rooms
export const bookings = lodge.demoBookings