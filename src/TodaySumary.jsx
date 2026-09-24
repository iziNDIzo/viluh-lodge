import { rooms, addDays, today } from './data'

const money = (n) => `MK ${n.toLocaleString()}`

function Card({ label, value, note }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
      {note && <p className="text-xs text-slate-400">{note}</p>}
    </div>
  )
}

function GuestList({ title, items, roomOf, onSelect, empty }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h3 className="mb-2 text-sm font-bold">
        {title} ({items.length})
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-slate-400">{empty}</p>
      ) : (
        <ul className="space-y-1">
          {items.map((b) => (
            <li key={b.id}>
              <button
                type="button"
                onClick={() => onSelect(b)}
                className="flex w-full items-center justify-between rounded-lg bg-slate-50 p-2 text-left text-sm hover:bg-emerald-50"
              >
                <span className="font-medium">{b.guest}</span>
                <span className="text-xs text-slate-500">
                  {roomOf(b).name} · {b.nights} night{b.nights > 1 ? 's' : ''}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function TodaySummary({ bookings, onSelect }) {
  const roomOf = (b) => rooms.find((r) => r.id === b.roomId)
  const priceOf = (b) => roomOf(b)?.price ?? 0

  const arrivals = bookings.filter((b) => b.start === 0)
  const departures = bookings.filter((b) => b.start + b.nights === 0)
  const inHouse = bookings.filter((b) => b.start <= 0 && b.start + b.nights > 0)

  // Income from rooms occupied tonight
  const tonight = inHouse.reduce((sum, b) => sum + priceOf(b), 0)

  // Income from the next 7 nights (tonight + 6 more)
  const week = bookings.reduce((sum, b) => {
    const from = Math.max(b.start, 0)
    const to = Math.min(b.start + b.nights, 7)
    return sum + Math.max(0, to - from) * priceOf(b)
  }, 0)

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold">
        Today,{' '}
        {today.toLocaleDateString('en', {
          weekday: 'long',
          day: 'numeric',
          month: 'short',
        })}
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <Card label="Arrivals" value={arrivals.length} />
        <Card label="Departures" value={departures.length} />
        <Card
          label="Tonight's income"
          value={money(tonight)}
          note={`${inHouse.length} room${inHouse.length === 1 ? '' : 's'} occupied`}
        />
        <Card label="Next 7 nights" value={money(week)} note="expected income" />
      </div>

      <GuestList
        title="Arriving today"
        items={arrivals}
        roomOf={roomOf}
        onSelect={onSelect}
        empty="No arrivals today"
      />
      <GuestList
        title="Departing today"
        items={departures}
        roomOf={roomOf}
        onSelect={onSelect}
        empty="No departures today"
      />
    </section>
  )
}