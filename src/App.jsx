import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import GuestBooking from './GuestBooking'
import QrCard from './QrCard'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  if (route === '#/book') return <GuestBooking />
  if (route === '#/qr') return <QrCard />
  return <Dashboard />
}