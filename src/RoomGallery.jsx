import { rooms } from './data'
import { LODGE_NAME } from './shared'

export default function RoomGallery() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-slate-900 px-4 py-5 text-white">
        <p className="text-sm text-emerald-400">Powered by Viluh Systems</p>
        <h1 className="text-xl font-bold">{LODGE_NAME}</h1>
        <p className="text-sm text-slate-300">Our rooms</p>
      </header>

      <main className="mx-auto max-w-md space-y-4 p-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <img
              src={room.image}
              alt={room.name}
              className="h-48 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-1 p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold">{room.name}</h2>
                <span className="text-sm font-medium text-slate-500">
                  {room.type}
                </span>
              </div>
              {room.description && (
                <p className="text-sm text-slate-600">{room.description}</p>
              )}
              <p className="text-sm font-bold text-emerald-600">
                MK {room.price.toLocaleString()} / night
              </p>
              <a
                href="#/book"
                className="mt-2 block rounded-lg bg-emerald-500 p-2 text-center font-medium text-white hover:bg-emerald-600"
              >
                Check availability
              </a>
            </div>
          </div>
        ))}

        <a
          href="#/book"
          className="block text-center text-xs text-slate-400 underline"
        >
          Skip to booking →
        </a>
      </main>
    </div>
  )
}