import { QRCodeSVG } from 'qrcode.react'
import { LODGE_NAME } from './shared'
import { lodge } from './config'

export default function QrCard() {
 const LIVE_URL = lodge.liveUrl
const base =
  window.location.hostname === 'localhost'
    ? LIVE_URL
    : window.location.origin
const url = `${base}/#/book`

  return (
    <div className="min-h-screen bg-slate-100 p-4 text-slate-800 print:bg-white print:p-0">
      <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 text-center shadow print:shadow-none">
        <p className="text-sm text-emerald-600">Welcome to</p>
        <h1 className="text-3xl font-bold">{LODGE_NAME}</h1>
        <p className="mt-2 text-slate-500">Scan to book your stay</p>

        <div className="my-6 flex justify-center">
          <div className="bg-white p-3">
            <QRCodeSVG value={url} size={220} level="M" />
          </div>
        </div>

        <p className="break-all text-xs text-slate-400">{url}</p>
        <p className="mt-6 text-xs text-slate-400">Powered by Viluh Systems</p>
      </div>

      <div className="mx-auto mt-4 flex max-w-sm gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 rounded-lg bg-emerald-500 p-3 font-medium text-white hover:bg-emerald-600"
        >
          Print card
        </button>
        <a
          href="#/"
          className="flex-1 rounded-lg border border-slate-300 bg-white p-3 text-center font-medium"
        >
          Back
        </a>
      </div>
    </div>
  )
}