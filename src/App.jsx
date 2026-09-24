import { useState } from 'react'
import { rooms, bookings as initialBookings, addDays, today } from './data'

const DAYS = 14

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default function App() {
  const [bookings, setBookings] = useState(initialBookings)
  const [draft, setDraft] = useState(null)
  const [guest, setGuest] = useState('')
  const [nights, setNights] = useState(1)
  const [error, setError] = useState('')

  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i))

  const bookingFor = (roomId, dayIndex) =>
    bookings.find(
      (b) =>
        b.roomId === roomId &&
        dayIndex >= b.start &&
        dayIndex < b.start + b.nights
    )

  const openDraft = (roomId, start) => {
    setDraft({ roomId, start })
    setGuest('')
    setNights(1)
    setError('')
  }

  const saveBooking = () => {
    if (!guest.trim()) {
      setError('Please enter the guest name')
      return
    }
    const end = draft.start + nights
    const clash = bookings.some(
      (b) =>
        b.roomId === draft.roomId &&
        draft.start < b.start + b.nights &&
        end > b.start
    )
    if (clash) {
      setError('These dates overlap an existing booking')
      return
    }
    setBookings([
      ...bookings,
      {
        id: Date.now(),
        roomId: draft.roomId,
        guest: guest.trim(),
        start: draft.start,
        nights,
      },
    ])
    setDraft(null)
  }

  const cancelBooking = (b) => {
    if (window.confirm(`Cancel ${b.guest}'s booking?`)) {
      setBookings(bookings.filter((x) => x.id !== b.id))
    }
  }

  const occupiedToday = rooms.filter((r) => bookingFor(r.id, 0)).length
  const arrivals = bookings.filter((b) => b.start === 0).length
  const occupancy = Math.round((occupiedToday / rooms.length) * 100)
  const draftRoom = draft ? rooms.find((r) => r.id === draft.roomId) : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-slate-900 px-4 py-5 text-white">
        <p className="text-sm text-emerald-400">Powered by Viluh Systems</p>
        <h1 className="text-xl font-bold">Lakeview Lodge</h1>
      </header>

      <main className="space-y-4 p-4">
        <section className="grid grid-cols-3 gap-3">
          <Stat label="Occupancy" value={`${occupancy}%`} />
          <Stat label="Arrivals today" value={arrivals} />
          <Stat label="Free rooms" value={rooms.length - occupiedToday} />
        </section>

        <p className="text-xs text-slate-500">
          Tap an empty day to add a booking. Tap a green block to cancel it.
        </p>

        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white p-2 text-left">Room</th>
                {days.map((d, i) => (
                  <th
                    key={i}
                    className={`min-w-14 p-2 text-center font-medium ${
                      i === 0 ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    <div>{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                    <div>{d.getDate()}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-t border-slate-100">
                  <td className="sticky left-0 bg-white p-2 font-medium">
                    {room.name}
                    <div className="text-xs font-normal text-slate-400">
                      {room.type}
                    </div>
                  </td>
                  {days.map((_, i) => {
                    const b = bookingFor(room.id, i)
                    return (
                      <td key={i} className="p-1">
                        <button
                          type="button"
                          onClick={() =>
                            b ? cancelBooking(b) : openDraft(room.id, i)
                          }
                          title={b ? b.guest : 'Available'}
                          className={`h-10 w-full cursor-pointer rounded-md px-1 text-left text-xs ${
                            b
                              ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                              : 'bg-slate-100 hover:bg-emerald-100'
                          }`}
                        >
                          {b && i === Math.max(b.start, 0) ? b.guest : ''}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {draft && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-sm space-y-4 rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <div>
              <h2 className="text-lg font-bold">New booking</h2>
              <p className="text-sm text-slate-500">
                {draftRoom.name} ({draftRoom.type}) from{' '}
                {addDays(today, draft.start).toLocaleDateString('en', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                })}
              </p>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              Guest name
              <input
                autoFocus
                value={guest}
                onChange={(e) => {
                  setGuest(e.target.value)
                  setError('')
                }}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Enter guest name"
              />
            </label>

            <label className="block text-sm font-medium text-slate-700">
              Nights
              <input
                type="number"
                min="1"
                max={DAYS - draft.start}
                value={nights}
                onChange={(e) =>
                  setNights(
                    Math.max(
                      1,
                      Math.min(DAYS - draft.start, Number(e.target.value) || 1)
                    )
                  )
                }
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveBooking}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}