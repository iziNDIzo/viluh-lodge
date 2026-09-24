import { rooms, bookings, addDays, today } from './data'

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
  const days = Array.from({ length: DAYS }, (_, i) => addDays(today, i))

  const bookingFor = (roomId, dayIndex) =>
    bookings.find(
      (b) =>
        b.roomId === roomId &&
        dayIndex >= b.start &&
        dayIndex < b.start + b.nights
    )

  const occupiedToday = rooms.filter((r) => bookingFor(r.id, 0)).length
  const arrivals = bookings.filter((b) => b.start === 0).length
  const occupancy = Math.round((occupiedToday / rooms.length) * 100)

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

        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-white p-2 text-left">
                  Room
                </th>
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
                  <td className="sticky left-0 z-10 bg-white p-2 font-medium">
                    {room.name}
                    <div className="text-xs font-normal text-slate-400">
                      {room.type}
                    </div>
                  </td>
                  {days.map((_, i) => {
                    const b = bookingFor(room.id, i)
                    return (
                      <td key={i} className="p-1">
                        <div
                          title={b ? b.guest : 'Available'}
                          className={`h-10 rounded-md px-1 text-xs leading-10 ${
                            b
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100'
                          }`}
                        >
                          {b && i === Math.max(b.start, 0) ? b.guest : ''}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}