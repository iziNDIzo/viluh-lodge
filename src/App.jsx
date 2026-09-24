import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'
import GuestBooking from './GuestBooking'

export default function App() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route === '#/book' ? <GuestBooking /> : <Dashboard />
}