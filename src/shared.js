import { bookings as demoBookings, today } from './data'

export const LODGE_NAME = 'Nezzer Lodge'
// Put a WhatsApp number here (use your own while testing)
export const LODGE_PHONE = '0884125795'

const BOOKINGS_KEY = 'lodge-bookings-v1'
export const REQUESTS_KEY = 'lodge-requests-v1'

export const fmt = (date) =>
  date.toLocaleDateString('en', { day: 'numeric', month: 'short' })

// Turns 0991234567 or +265 991 234 567 into 265991234567 for WhatsApp
export const toWaNumber = (phone = '') => {
  let d = phone.replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = '265' + d.slice(1)
  else if (d.length === 9) d = '265' + d
  return d
}

// Date -> "2026-09-27" (what <input type="date"> uses)
export const toInputDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// "2026-09-27" -> number of days from today
export const dayOffset = (value) => {
  const [y, m, d] = value.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return Math.round((date.getTime() - today.getTime()) / 86400000)
}

// Is this room free for these dates?
export const isFree = (bookings, roomId, start, nights) =>
  !bookings.some(
    (b) =>
      b.roomId === roomId &&
      start < b.start + b.nights &&
      start + nights > b.start
  )

export function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    if (!raw) return demoBookings
    const { savedOn, bookings } = JSON.parse(raw)
    const shift = Math.round((today.getTime() - savedOn) / 86400000)
    return bookings
      .map((b) => ({ ...b, start: b.start - shift }))
      .filter((b) => b.start + b.nights > 0)
  } catch {
    return demoBookings
  }
}

export function saveBookings(bookings) {
  try {
    localStorage.setItem(
      BOOKINGS_KEY,
      JSON.stringify({ savedOn: today.getTime(), bookings })
    )
  } catch {
    // storage unavailable, the app still works without saving
  }
}

export function loadRequests() {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY)
    if (!raw) return []
    return JSON.parse(raw).filter((r) => dayOffset(r.checkIn) >= 0)
  } catch {
    return []
  }
}

export function saveRequests(requests) {
  try {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests))
  } catch {
    // storage unavailable, the app still works without saving
  }
}