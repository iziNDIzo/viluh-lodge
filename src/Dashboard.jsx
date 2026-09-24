import { useState, useEffect } from 'react'
import { rooms, bookings as initialBookings, addDays, today } from './data'
import {
  LODGE_NAME,
  REQUESTS_KEY,
  fmt,
  toWaNumber,
  dayOffset,
  isFree,
  loadBookings,
  saveBookings,
  loadRequests,
  saveRequests,
} from './shared'
import TodaySummary from './TodaySummary'
const DAYS = 14

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const [bookings, setBookings] = useState(loadBookings)
  const [requests, setRequests] = useState(loadRequests)
  const [draft, setDraft] = useState(null)
  const [selected, setSelected] = useState(null)
  const [guest, setGuest] = useState('')
  const [phone, setPhone] = useState('')
  const [nights, setNights] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    saveBookings(bookings)
  }, [bookings])

  useEffect(() => {
    saveRequests(requests)
  }, [requests])

  // If a guest sends a request from another tab, show it live
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === REQUESTS_KEY) setRequests(loadRequests())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

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
    setPhone('')
    setNights(1)
    setError('')
  }

  const saveBooking = () => {
    if (!guest.trim()) {
      setError('Please enter the guest name')
      return
    }
    if (!isFree(bookings, draft.roomId, draft.start, nights)) {
      setError('These dates overlap an existing booking')
      return
    }
    const newBooking = {
      id: Date.now(),
      roomId: draft.roomId,
      guest: guest.trim(),
      phone: phone.trim(),
      start: draft.start,
      nights,
    }
    setBookings([...bookings, newBooking])
    setDraft(null)
    setSelected(newBooking)
  }

  const cancelBooking = (b) => {
    if (window.confirm(`Cancel ${b.guest}'s booking?`)) {
      setBookings(bookings.filter((x) => x.id !== b.id))
      setSelected(null)
    }
  }

  const approveRequest = (r) => {
    const start = dayOffset(r.checkIn)
    if (!isFree(bookings, r.roomId, start, r.nights)) {
      window.alert('Sorry, those dates are no longer free for that room.')
      return
    }
    const newBooking = {
      id: Date.now(),
      roomId: r.roomId,
      guest: r.guest,
      phone: r.phone,
      start,
      nights: r.nights,
    }
    setBookings([...bookings, newBooking])
    setRequests(requests.filter((x) => x.id !== r.id))
    setSelected(newBooking)
  }

  const declineRequest = (r) => {
    if (window.confirm(`Decline ${r.guest}'s request?`)) {
      setRequests(requests.filter((x) => x.id !== r.id))
    }
  }

  const resetDemo = () => {
    if (window.confirm('Reset to the original demo bookings?')) {
      setBookings(initialBookings)
      setRequests([])
      setSelected(null)
    }
  }

  const whatsappLink = (b) => {
    const room = rooms.find((r) => r.id === b.roomId)
    const checkIn = fmt(addDays(today, b.start))
    const checkOut = fmt(addDays(today, b.start + b.nights))
    const total = (b.nights * room.price).toLocaleString()
    const message =
      `Hello ${b.guest}, your booking at ${LODGE_NAME} is confirmed.\n\n` +
      `Room: ${room.name} (${room.type})\n` +
      `Check-in: ${checkIn}\n` +
      `Check-out: ${checkOut} (${b.nights} night${b.nights > 1 ? 's' : ''})\n` +
      `Total: MK ${total}\n\n` +
      `We look forward to hosting you!`
    return `https://wa.me/${toWaNumber(b.phone)}?text=${encodeURIComponent(message)}`
  }

  const occupiedToday = rooms.filter((r) => bookingFor(r.id, 0)).length
  const arrivals = bookings.filter((b) => b.start === 0).length
  const occupancy = Math.round((occupiedToday / rooms.length) * 100)
  const draftRoom = draft ? rooms.find((r) => r.id === draft.roomId) : null
  const selectedRoom = selected
    ? rooms.find((r) => r.id === selected.roomId)
    : null

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-slate-900 px-4 py-5 text-white">
        <p className="text-sm text-emerald-400">Powered by Viluh Systems</p>
        <h1 className="text-xl font-bold">{LODGE_NAME}</h1>
          <div className="mt-2 flex gap-4 text-xs text-emerald-300">
          <a href="#/book" className="underline">
            View guest booking page →
          </a>
          <a href="#/qr" className="underline">
            Print QR card →
          </a>
        </div>
      </header>

      <main className="space-y-4 p-4">
        {requests.length > 0 && (
          <section className="space-y-2 rounded-xl border border-amber-200 bg-amber-50 p-3">
            <h2 className="text-sm font-bold text-amber-800">
              Booking requests ({requests.length})
            </h2>
            {requests.map((r) => {
              const room = rooms.find((x) => x.id === r.roomId)
              const start = dayOffset(r.checkIn)
              return (
                <div key={r.id} className="rounded-lg bg-white p-3 text-sm shadow-sm">
                  <p className="font-medium">
                    {r.guest}{' '}
                    <span className="font-normal text-slate-500">{r.phone}</span>
                  </p>
                  <p className="text-slate-600">
                    {room.name} ({room.type}) · {fmt(addDays(today, start))} to{' '}
                    {fmt(addDays(today, start + r.nights))} · {r.nights} night
                    {r.nights > 1 ? 's' : ''} · MK{' '}
                    {(r.nights * room.price).toLocaleString()}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => approveRequest(r)}
                      className="flex-1 rounded-lg bg-emerald-500 p-2 font-medium text-white hover:bg-emerald-600"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => declineRequest(r)}
                      className="flex-1 rounded-lg border border-slate-300 p-2 font-medium"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        )}
        <TodaySummary bookings={bookings} onSelect={setSelected} />
        <section className="grid grid-cols-2 gap-3">
          <Stat label="Occupancy" value={`${occupancy}%`} />
         
          <Stat label="Free rooms" value={rooms.length - occupiedToday} />
        </section>

        <p className="text-xs text-slate-500">
          Tap an empty day to add a booking. Tap a green block to message the
          guest or cancel.
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
                            b ? setSelected(b) : openDraft(room.id, i)
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

        <button
          type="button"
          onClick={resetDemo}
          className="text-xs text-slate-400 underline"
        >
          Reset demo data
        </button>
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

            <label className="block text-sm font-medium">
              Guest name
              <input
                value={guest}
                onChange={(e) => setGuest(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
                placeholder="e.g. Chisomo"
                autoFocus
              />
            </label>

            <label className="block text-sm font-medium">
              WhatsApp number (optional)
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
                placeholder="e.g. 0991 234 567"
              />
            </label>

            <label className="block text-sm font-medium">
              Nights
              <input
                type="number"
                min="1"
                value={nights}
                onChange={(e) =>
                  setNights(Math.max(1, Number(e.target.value) || 1))
                }
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
              />
            </label>

            <p className="text-sm">
              Total:{' '}
              <span className="font-bold">
                MK {(nights * draftRoom.price).toLocaleString()}
              </span>
            </p>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="flex-1 rounded-lg border border-slate-300 p-2 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveBooking}
                className="flex-1 rounded-lg bg-emerald-500 p-2 font-medium text-white hover:bg-emerald-600"
              >
                Save booking
              </button>
            </div>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="w-full max-w-sm space-y-4 rounded-t-2xl bg-white p-5 sm:rounded-2xl">
            <div>
              <h2 className="text-lg font-bold">{selected.guest}</h2>
              <p className="text-sm text-slate-500">
                {selectedRoom.name} ({selectedRoom.type})
              </p>
            </div>

            <div className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm">
              <p>
                <span className="text-slate-500">Check-in:</span>{' '}
                {fmt(addDays(today, selected.start))}
              </p>
              <p>
                <span className="text-slate-500">Check-out:</span>{' '}
                {fmt(addDays(today, selected.start + selected.nights))} (
                {selected.nights} night{selected.nights > 1 ? 's' : ''})
              </p>
              <p>
                <span className="text-slate-500">Total:</span>{' '}
                <span className="font-bold">
                  MK {(selected.nights * selectedRoom.price).toLocaleString()}
                </span>
              </p>
              {selected.phone && (
                <p>
                  <span className="text-slate-500">Phone:</span>{' '}
                  {selected.phone}
                </p>
              )}
            </div>

            <a
              href={whatsappLink(selected)}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg bg-green-600 p-3 text-center font-medium text-white hover:bg-green-700"
            >
              Confirm on WhatsApp
            </a>
            {!selected.phone && (
              <p className="text-xs text-slate-500">
                No number saved, so WhatsApp will let you pick the contact.
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => cancelBooking(selected)}
                className="flex-1 rounded-lg border border-red-300 p-2 font-medium text-red-600 hover:bg-red-50"
              >
                Cancel booking
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 rounded-lg border border-slate-300 p-2 font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}