import { useState } from 'react'
import { rooms, addDays, today } from './data'
import {
  LODGE_NAME,
  LODGE_PHONE,
  fmt,
  toWaNumber,
  toInputDate,
  dayOffset,
  isFree,
  loadBookings,
  loadRequests,
  saveRequests,
} from './shared'

export default function GuestBooking() {
  const [bookings] = useState(loadBookings)
  const [checkIn, setCheckIn] = useState(toInputDate(today))
  const [nights, setNights] = useState(1)
  const [roomId, setRoomId] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(null)

  const start = checkIn ? dayOffset(checkIn) : NaN
  const datesOk = Number.isFinite(start) && start >= 0
  const available = datesOk
    ? rooms.filter((r) => isFree(bookings, r.id, start, nights))
    : []
  const chosen = available.find((r) => r.id === roomId) || null

  const submit = () => {
    if (!chosen) {
      setError('Please choose a room')
      return
    }
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!phone.trim()) {
      setError('Please enter your phone number')
      return
    }
    const request = {
      id: Date.now(),
      guest: name.trim(),
      phone: phone.trim(),
      roomId: chosen.id,
      checkIn,
      nights,
    }
    saveRequests([...loadRequests(), request])
    setError('')
    setSent(request)
  }

  const startOver = () => {
    setSent(null)
    setRoomId(null)
    setName('')
    setPhone('')
  }

  const header = (
    <header className="bg-slate-900 px-4 py-5 text-white">
      <p className="text-sm text-emerald-400">Powered by Viluh Systems</p>
      <h1 className="text-xl font-bold">{LODGE_NAME}</h1>
      <p className="text-sm text-slate-300">Book your stay</p>
    </header>
  )

  if (sent) {
    const room = rooms.find((r) => r.id === sent.roomId)
    const inDate = addDays(today, dayOffset(sent.checkIn))
    const outDate = addDays(inDate, sent.nights)
    const total = (sent.nights * room.price).toLocaleString()
    const message =
      `Hello ${LODGE_NAME}, I would like to book:\n\n` +
      `Room: ${room.name} (${room.type})\n` +
      `Check-in: ${fmt(inDate)}\n` +
      `Check-out: ${fmt(outDate)} (${sent.nights} night${sent.nights > 1 ? 's' : ''})\n` +
      `Total: MK ${total}\n\n` +
      `Name: ${sent.guest}\n` +
      `Phone: ${sent.phone}`
    const link = `https://wa.me/${toWaNumber(LODGE_PHONE)}?text=${encodeURIComponent(message)}`

    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        {header}
        <main className="mx-auto max-w-md space-y-4 p-4">
          <div className="space-y-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <h2 className="text-lg font-bold text-emerald-800">
              Request received
            </h2>
            <p className="text-sm">
              Thank you, {sent.guest}. {room.name} ({room.type}),{' '}
              {fmt(inDate)} to {fmt(outDate)}, MK {total}.
            </p>
            <p className="text-sm text-slate-600">
              The lodge will confirm your booking. For a faster reply, send your
              request on WhatsApp too.
            </p>
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg bg-green-600 p-3 text-center font-medium text-white hover:bg-green-700"
            >
              Send on WhatsApp
            </a>
          </div>
          <button
            type="button"
            onClick={startOver}
            className="w-full rounded-lg border border-slate-300 p-2 font-medium"
          >
            Make another request
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {header}
      <main className="mx-auto max-w-md space-y-4 p-4">
        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <label className="block text-sm font-medium">
            Check-in date
            <input
              type="date"
              min={toInputDate(today)}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 p-2"
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

          {datesOk && (
            <p className="text-xs text-slate-500">
              Check-out: {fmt(addDays(today, start + nights))}
            </p>
          )}
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold">Available rooms</h2>
          {!datesOk && (
            <p className="text-sm text-slate-500">
              Choose a check-in date from today onward.
            </p>
          )}
          {datesOk && available.length === 0 && (
            <p className="text-sm text-slate-500">
              No rooms are free for these dates. Try different dates.
            </p>
          )}
          {available.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => setRoomId(room.id)}
              className={`flex w-full items-center justify-between rounded-lg border p-3 text-left ${
                chosen && chosen.id === room.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <span>
                <span className="font-medium">{room.name}</span>
                <span className="block text-xs text-slate-500">
                  {room.type} · MK {room.price.toLocaleString()} per night
                </span>
              </span>
              <span className="text-sm font-bold">
                MK {(room.price * nights).toLocaleString()}
              </span>
            </button>
          ))}
        </section>

        {chosen && (
          <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="block text-sm font-medium">
              Your name
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
                placeholder="e.g. Chisomo"
              />
            </label>

            <label className="block text-sm font-medium">
              Phone / WhatsApp number
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2"
                placeholder="e.g. 0991 234 567"
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="button"
              onClick={submit}
              className="w-full rounded-lg bg-emerald-500 p-3 font-medium text-white hover:bg-emerald-600"
            >
              Request booking
            </button>
          </section>
        )}

        {!chosen && error && <p className="text-sm text-red-600">{error}</p>}

        <a href="#/" className="block text-center text-xs text-slate-400 underline">
          ← Lodge dashboard (demo only)
        </a>
      </main>
    </div>
  )
}