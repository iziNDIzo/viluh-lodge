export const today = new Date()
today.setHours(0, 0, 0, 0)

export const addDays = (date, n) => {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export const rooms = [
  { id: 1, name: 'Room 1', type: 'Single', price: 35000 },
  { id: 2, name: 'Room 2', type: 'Double', price: 50000 },
  { id: 3, name: 'Room 3', type: 'Double', price: 50000 },
  { id: 4, name: 'Room 4', type: 'Family', price: 75000 },
  { id: 5, name: 'Room 5', type: 'Lake view', price: 90000 },
]

// start = days from today, nights = length of stay
export const bookings = [
  { id: 1, roomId: 1, guest: 'Chikondi', start: 0, nights: 3 },
  { id: 2, roomId: 2, guest: 'Mercy', start: 1, nights: 2 },
  { id: 3, roomId: 3, guest: 'Yamikani', start: -1, nights: 4 },
  { id: 4, roomId: 4, guest: 'Thoko', start: 3, nights: 5 },
  { id: 5, roomId: 5, guest: 'Kondwani', start: 0, nights: 2 },
  { id: 6, roomId: 5, guest: 'Limbani', start: 6, nights: 3 },
    { id: 7, roomId: 2, guest: 'Blessings', start: -2, nights: 2 },
]