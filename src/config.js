// Brand palettes (Tailwind shades). Add more if you like.
const palettes = {
  emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 800: '#065f46' },
  blue: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 800: '#1e40af' },
  orange: { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 300: '#fdba74', 400: '#fb923c', 500: '#f97316', 600: '#ea580c', 800: '#9a3412' },
  rose: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 800: '#9f1239' },
}

const lodges = {
  nezzer: {
    name: 'Nezzer Lodge',
    phone: '0884125795', // WhatsApp number guests message
    liveUrl: 'https://viluh-lodge.vercel.app', // used by the QR card
    palette: 'emerald',
    rooms: [
      { id: 1, name: 'Room 1', type: 'Single', price: 35000 },
      { id: 2, name: 'Room 2', type: 'Double', price: 50000 },
      { id: 3, name: 'Room 3', type: 'Double', price: 50000 },
      { id: 4, name: 'Room 4', type: 'Family', price: 75000 },
      { id: 5, name: 'Room 5', type: 'Lake view', price: 90000 },
    ],
    // start = days from today, nights = length of stay
    demoBookings: [
      { id: 1, roomId: 1, guest: 'Chikondi', start: 0, nights: 3 },
      { id: 2, roomId: 2, guest: 'Mercy', start: 1, nights: 2 },
      { id: 3, roomId: 3, guest: 'Yamikani', start: -1, nights: 4 },
      { id: 4, roomId: 4, guest: 'Thoko', start: 3, nights: 5 },
      { id: 5, roomId: 5, guest: 'Kondwani', start: 0, nights: 2 },
      { id: 6, roomId: 5, guest: 'Limbani', start: 6, nights: 3 },
      { id: 7, roomId: 2, guest: 'Blessings', start: -2, nights: 2 },
    ],
  },

  // To add a lodge: copy the block above, change the key and every value.
  // example: {
  //   name: 'Example Lodge',
  //   phone: '0888 000 000',
  //   liveUrl: 'https://example-lodge.vercel.app',
  //   palette: 'blue',
  //   rooms: [ ... ],
  //   demoBookings: [ ... ],
  // },
}

// Which lodge this deployment shows. Set VITE_LODGE per Vercel project.
const key = import.meta.env.VITE_LODGE || 'nezzer'
export const lodge = lodges[key] || lodges.nezzer

// Applies the brand color and the browser tab title
export function applyBrand() {
  const colors = palettes[lodge.palette] || palettes.blue
  const root = document.documentElement
  Object.entries(colors).forEach(([shade, value]) => {
   root.style.setProperty(`--brand-${shade}`, value)
  })
  document.title = lodge.name
}